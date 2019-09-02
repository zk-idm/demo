/**
 * ZoKrates ZK-SNARK control.
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
const stripHexPrefix = require('../node_modules/strip-hex-prefix'),
      { execFileSync } = require('child_process'),
      toolsEth = require('./tools.eth.js'),
      tools = require('./tools.js');

let control = 'snark';

module.exports.display = function () {
  let ret = tools.getHeadline(control) + tools.getHeader(control) +
          tools.getInfo() + tools.getActions(control) + tools.getBody();
  tools.cleanupBody();
  return ret;
};

module.exports.getBalance = function (user) {
  toolsEth.getBalance(user, control);
};

module.exports.getTransactionCount = function (user) {
  toolsEth.getTransactionCount(user, control);
};

module.exports.getGasPrice = function () {
  toolsEth.getGasPrice(control);
};

module.exports.ethTransfer = function (user, input) {
  toolsEth.ethTransfer(user, input, control);
};

module.exports.compile = function (user, input, ret) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  if (!tools.checkEnvVar(global.config.zokrates.environmentVar)) return;
  let cmd = ['compile', '-i', input.filePath, '-o', input.outPath];
  try {
    let res = execFileSync(global.config.zokrates.executablePath, cmd,
      { maxBuffer: global.config.node.exec.maxBuffer }).toString();
    res = { out: input.outPath, outCode: input.outPath + '.code' };
    if (ret) { console.log(res); return res; }
    else {
      tools.addHistory(control, res, {fnc: 'compile'});
      console.log(res);
    }
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.computeWitness = function (user, input, ret) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  if (!tools.checkEnvVar(global.config.zokrates.environmentVar)) return;
  const web3 = toolsEth.getWeb3();
  let cmd = ['compute-witness', '-i', input.inPath, '-o', input.outPath];
  if (input.document) {
    let doc = stripHexPrefix(web3.utils.padLeft(input.document, 128));
    let arguments = [
      web3.utils.hexToNumberString('0x' + doc.substr(0, 32)),
      web3.utils.hexToNumberString('0x' + doc.substr(32, 32)),
      web3.utils.hexToNumberString('0x' + doc.substr(64, 32)),
      web3.utils.hexToNumberString('0x' + doc.substr(96, 32))
    ];
    cmd.push('-a');
    arguments.forEach(function (arg) {
      cmd.push(arg);
    });
  }
  try {
    let res = execFileSync(global.config.zokrates.executablePath, cmd,
      { maxBuffer: global.config.node.exec.maxBuffer }).toString();
    res = {
      witnessFile: input.outPath,
      witness: tools.getWitness(input.outPath)
    };
    if (ret) { console.log(res); return res; }
    else {
      tools.addHistory(control, res, {fnc: 'computeWitness'});
      console.log(res);
    }
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.setup = function (user, input, ret) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  if (!tools.checkEnvVar(global.config.zokrates.environmentVar)) return;
  let cmd = ['setup', '-i', input.inPath,
    '-p', input.provingKeyPath, '-s', input.provingScheme,
    '-v', input.verificationKeyPath];
  try {
    let res = execFileSync(global.config.zokrates.executablePath, cmd,
      { maxBuffer: global.config.node.exec.maxBuffer }).toString();
    res = {
      provingKey: input.provingKeyPath,
      verificationKey: input.verificationKeyPath
    };
    if (ret) { console.log(res); return res; }
    else {
      tools.addHistory(control, res, {fnc: 'setup'});
      console.log(res);
    }
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.exportVerifier = function (user, input, ret) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  if (!tools.checkEnvVar(global.config.zokrates.environmentVar)) return;
  let cmd = ['export-verifier', '-i', input.inPath, 
    '-o', input.outPath, '-s', input.provingScheme];
  try {
    let res = execFileSync(global.config.zokrates.executablePath, cmd,
      { maxBuffer: global.config.node.exec.maxBuffer }).toString();
    res = { solidityContract: input.outPath };
    if (ret) { console.log(res); return res; }
    else {
      tools.addHistory(control, res, {fnc: 'exportVerifier'});
      console.log(res);
    }
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.deployContract = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  const web3 = toolsEth.getWeb3();
  let source = tools.getSourceFile(input.inPath);
  if (source) {
    compiles = toolsEth.getGeneratedBytecode(source.toString());
    console.log('Deploying contracts.');
    web3.eth.getTransactionCount(user.credentials.address)
    .then(function (nonce) {
      web3.eth.getGasPrice().then(function (gasPrice) {
        nonce--;
        compiles.forEach(function (compile) {
          let contract = new web3.eth.Contract(compile.abi);
          let deploy = contract.deploy({
              data: '0x' + compile.bytecode
          }).encodeABI();
          let tx = toolsEth.getTx(user, {nonce: ++nonce,
              gasPrice: Number(gasPrice),
              gasLimit: Number(input.gasLimit),
              data: deploy, from: user.credentials.address});
          web3.eth.sendSignedTransaction('0x' + tx.toString('hex'))
          .on('confirmation', function (confirmationNo, receipt) {
            if (confirmationNo ===
                global.config.node.web3.waitConfirmations) {
              tools.displayTiming('deployContract_' + compile.name);
              tools.addHistory(control, receipt, {fnc: 'deployContract',
                      contract: compile.name});
              console.log(receipt);
            }
          }).on('error', function (err){ console.error(err); });
        });
      });
    });
  }
};

module.exports.monitorVerification  = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  const web3 = toolsEth.getWeb3();
  web3.eth.getBlockNumber().then(function (blockNo) {
    let contract = new web3.eth.Contract(input.contractAbi,
            input.contractAddress);
    tools.displayTiming('monitorVerification');
    contract.events.Verified({ fromBlock: Number(blockNo) })
    .on('data', (event) => { console.log(event); })
    .on('error', console.error);
  });
};

module.exports.generateProof = function (user, input, ret) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  if (!tools.checkEnvVar(global.config.zokrates.environmentVar)) return;
  let cmd = ['generate-proof', '-i', input.inPath, '-j', input.proofPath,
    '-s', input.provingScheme, '-p', input.provingKeyPath,
    '-w', input.witnessPath];
  try {
    let res = execFileSync(global.config.zokrates.executablePath, cmd,
      { maxBuffer: global.config.node.exec.maxBuffer }).toString();
    res = { proof: input.proofPath };
    if (ret) { console.log(res); return res; }
    else {
      tools.addHistory(control, res, {fnc: 'generateProof'});
      console.log(res);
    }
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.submitProof  = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  const web3 = toolsEth.getWeb3();
  let proof = tools.getSourceFile(input.inPath);
  if (proof) {
    proof = JSON.parse(proof.toString());
    if (proof.proof && proof.inputs) {
      let contract = new web3.eth.Contract(input.contractAbi,
              input.contractAddress);
      let encoded = contract.methods.verifyTx(
              proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs
      ).encodeABI();
      web3.eth.getTransactionCount(user.credentials.address)
      .then(function (nonce) {
        web3.eth.getGasPrice().then(function (gasPrice) {
          let tx = toolsEth.getTx(user, {
              nonce:nonce, gasPrice:Number(gasPrice),
              gasLimit: Number(input.gasLimit), data: encoded,
              from: user.credentials.address, to:input.contractAddress});
          web3.eth.sendSignedTransaction('0x' + tx.toString('hex'))
          .on('confirmation', function (confirmationNo, receipt) {
            if (confirmationNo ===
                global.config.node.web3.waitConfirmations) {
              tools.displayTiming('submitProof');
              tools.addHistory(control, receipt, {fnc: 'submitProof'});
              console.log(receipt);
            }
          }).on('error', function (err){ console.error(err); });
        });
      });
    } else { console.error('Unable to submit proof.'); }
  }
};

module.exports.showHistory = function () {
  global.body.history = tools.getHistory(control);
};

module.exports.deleteHistory = function () {
  global.history[control] = {};
};