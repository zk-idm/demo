/**
 * Helper tools ethereum.
 * license: MIT
 * author: Christoph Leixnering
 * version: 1.0
 * date: 2019-07-01
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const Web3 = require('../node_modules/web3'),
      Tx = require('../node_modules/ethereumjs-tx').Transaction,
      stripHexPrefix = require('../node_modules/strip-hex-prefix'),
      solc = require('../node_modules/solc'),
      tools = require('./tools.js');

let w3 = null,
    w3local = null;

function getWeb3(data) {
  if (null === w3) {
    let endpoint = global.config.node.web3.endpoint;
    if (data && data.endpoint) { endpoint = data.endpoint; }
    if (data && data.provider === 'http') {
      w3 = new Web3(new Web3.providers.HttpProvider(endpoint));
    } else {
      w3 = new Web3(new Web3.providers.WebsocketProvider(endpoint));
    }
  }
  return w3;
};
module.exports.getWeb3 = getWeb3;

function getWeb3Local() {
  if (null === w3local) {
    w3local = new Web3(new Web3.providers.HttpProvider(
      global.config.node.web3.local.endpoint
    ));
  }
  return w3local;
};
module.exports.getWeb3Local = getWeb3Local;

module.exports.getBalance = function (user, control) {
  const web3 = getWeb3();
  web3.eth.getBalance(user.credentials.address)
  .then(function (res)
  {
    let balance = {  balance: web3.utils.fromWei(res, 'ether') };
    tools.addHistory(control, balance, {fnc: 'getBalance'});
    console.log(balance);
  });
};

module.exports.getTransactionCount = function (user, control) {
  const web3 = getWeb3();
  web3.eth.getTransactionCount(user.credentials.address)
  .then(function (res)
  {
    let transactionCount = { transactionCount: res };
    tools.addHistory(control, transactionCount,
            {fnc: 'getTransactionCount'});
    console.log(transactionCount);
  });
};

module.exports.getGasPrice = function (control) {
  const web3 = getWeb3();
  web3.eth.getGasPrice().then(function (res) {
    let gasPrice = { gasPrice: web3.utils.fromWei(res, 'ether') };
    tools.addHistory(control, gasPrice, {fnc: 'getGasPrice'});
    console.log(gasPrice);
  });
};

module.exports.getBlock = function (control, id='latest') {
  const web3 = getWeb3();
  web3.eth.getBlock(id).then(function (res) {
    let block = res;
    tools.addHistory(control, block, {fnc: 'getBlock'});
    console.log(block);
  });
};

function getTx(user, data) {
  let tx = new Tx(data, { chain: global.config.node.web3.chain,
      hardfork: global.config.node.web3.hardfork });
  tx.sign(Buffer.from(
          stripHexPrefix(user.credentials.privateKey), 'hex'));
  return tx.serialize();
};
module.exports.getTx = getTx;

module.exports.ethTransfer = function (user, input, control) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  const web3 = getWeb3();
  web3.eth.getTransactionCount(user.credentials.address)
  .then(function (nonce) {
    web3.eth.getGasPrice().then(function (gasPrice) {
      let tx = getTx(user, {nonce: nonce, gasPrice: Number(gasPrice),
          gasLimit: Number(input.gasLimit), to: input.to,
          value: Number(web3.utils.toWei(input.value.toString(),
                  'ether'))});
      web3.eth.sendSignedTransaction('0x' + tx.toString('hex'))
      .on('confirmation', function (confirmationNo, receipt) {
        if (confirmationNo === global.config.node.web3.waitConfirmations)
        {
          tools.addHistory(control, receipt, {fnc: 'ethTransfer'});
          console.log(receipt);
        }
      }).on('error', function (err){ console.error(err); });
    });
  });
};

module.exports.getGeneratedBytecode = function (source) {
  console.log('Generating bytecode.');
  let res = [];
  let solcConf = {
    language: 'Solidity',
    sources: { file: { content: source } },
    settings: { outputSelection: { '*': { '*': ['*'] } } }
  };
  let solcOut = JSON.parse(solc.compile(JSON.stringify(solcConf)));
  for (let contractName in solcOut.contracts.file) {
    res.push({
      name: contractName,
      bytecode: solcOut.contracts.file[contractName].evm.bytecode.object,
      abi: solcOut.contracts.file[contractName].abi
    });
    console.log('Bytecode of contract %s created.', contractName);
  }
  return res;
};