/**
 * System-Controller and SPROOF identity management control.
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
const { Sproof, Registration, Receiver, Card } =
        require('../node_modules/js-sproof-client'),
      sproofUtils = require('../node_modules/sproof-utils'),
      fs = require('fs'),
      zokrates = require('./zokrates.js'),
      ing = require('./ing.js'),
      toolsEth = require('./tools.eth.js'),
      tools = require('./tools.js');

let control = 'idm';

module.exports.display = function () {
  let ret = tools.getHeadline(control) + tools.getHeader(control) +
          tools.getInfo() + tools.getActions(control) + tools.getBody();
  tools.cleanupBody();
  return ret;
};

module.exports.getBalance = function (user) {
  toolsEth.getBalance(user, control);
};

module.exports.ethTransfer = function (user, input) {
  toolsEth.ethTransfer(user, input, control);
};

module.exports.newAccount = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  if (input.createNewAccount === true) {
    let sproof = new Sproof(global.config.sproof.init);
    let credentials = sproof.newAccount();
    tools.addHistory(control, credentials, {fnc: 'newAccount'});
    console.log(credentials);
  } else {
    let credentials = user;
    tools.addHistory(control, credentials, {fnc: 'newAccount'});
    console.log(credentials);
    console.log('No account created!');
  }
};

module.exports.registerProfile = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  let sproof = new Sproof(Object.assign({credentials: user.credentials},
      global.config.sproof.init));
  input = tools.prepareInput(input, {user: user});
  sproof.registerProfile(input);
  sproof.commit((err, res) => {
    if (err) console.error(err);
    else {
      tools.addHistory(control, res, {fnc: 'registerProfile'});
      console.log(res);
    }
  });
};

module.exports.updateProfile = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  let sproof = new Sproof(Object.assign({credentials: user.credentials},
      global.config.sproof.init));
  input = tools.prepareInput(input, {user: user});
  sproof.updateProfile(input);
  sproof.commit((err, res) => {
    if (err) console.error(err);
    else {
      tools.addHistory(control, res, {fnc: 'updateProfile'});
      console.log(res);
    }
  });
};

module.exports.getProfiles = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  let sproof = new Sproof(Object.assign({credentials: user.credentials},
      global.config.sproof.init));
  input = tools.prepareInput(input, {user: user});
  sproof.getProfiles(input, (err, res) => {
    if (err) console.error(err);
    else {
      tools.addHistory(control, res, {fnc: 'getProfiles'});
      console.log(res);
    }
  });
};

module.exports.getTransactions = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  let sproof = new Sproof(Object.assign({credentials: user.credentials},
      global.config.sproof.init));
  input = tools.prepareInput(input, {user: user});
  sproof.getTransactions(input, (err, res) => {
    if (err) console.error(err);
    else {
      tools.addHistory(control, res, {fnc: 'getTransactions'});
      console.log(res);
    }
  });
};

module.exports.getEvents = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  let sproof = new Sproof(Object.assign({credentials: user.credentials},
      global.config.sproof.init));
  input = tools.prepareInput(input, {user: user});
  sproof.getEvents(input, (err, res) => {
    if (err) console.error(err);
    else {
      tools.addHistory(control, res, {fnc: 'getEvents'});
      console.log(res);
    }
  });
};

module.exports.getRegistrations = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  let sproof = new Sproof(Object.assign({credentials: user.credentials},
      global.config.sproof.init));
  input = tools.prepareInput(input, {user: user});
  sproof.getRegistrations(input, (err, res) => {
    if (err) console.error(err);
    else {
      tools.addHistory(control, res, {fnc: 'getRegistrations'});
      console.log(res);
    }
  });
};

module.exports.getValidation = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  let sproof = new Sproof(Object.assign({credentials: user.credentials},
      global.config.sproof.init));
  input = tools.prepareInput(input, {user: user});
  sproof.getValidation(input, (err, res) => {
    if (err) console.error(err);
    else {
      tools.addHistory(control, res, {fnc: 'getValidation'});
      console.log(res);
    }
  });
};

module.exports.restoreCredentials = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  input = tools.prepareInput(input, {user: user});
  sproofUtils.restoreCredentials(input.mnemonic);
  console.log(sproofUtils.restoreCredentials(input.mnemonic));
};

module.exports.provideDocumentHash = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  let sproof = new Sproof(Object.assign({credentials: user.credentials},
      global.config.sproof.init));
  input = tools.prepareInput(input, {user: user});
  tools.startTiming('provideDocumentHash');
  let compile = zokrates.compile(user, JSON.stringify({
    filePath: input.zPath,
    outPath: input.compileOutPath
  }), true);
  tools.displayTiming('compile');
  if (compile.out && compile.outCode) {
    let witness = zokrates.computeWitness(user, JSON.stringify({
      document: input.document,
      inPath: compile.out,
      outPath: input.documentHashOutPath
    }), true);
    tools.displayTiming('computeWitness');
    if (witness.witnessFile && witness.witness) {
      data = Buffer.from(JSON.stringify({
        hD: witness.witness }), 'utf8');
      sproof.uploadFile(data, (err, res) => {
        if (err) console.error(err);
        else {
          tools.displayTiming('uploadFile');
          input.zPath = input.compileOutPath = input.document =
                  input.documentHashOutPath = null;
          input = tools.prepareInput(input, {user: user});
          input.documentHash = sproof.getHash(data);
          input.locationHash = res.hash;
          input.receivers = [input.addressV];
          sproof.registerDocument(new Registration(input));
          sproof.commit((err, res) => {
            if (err) console.error(err);
            else {
              tools.displayTiming('registerDocument');
              tools.addHistory(control, res, {
                fnc: 'provideDocumentHash'});
              console.log(res);
            }
          });
        }
      });
    } else { console.error('Unable to compute hD.'); }
  } else { console.error('Unable to compile z.'); }
};

module.exports.generateSnarkContract = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  input = tools.prepareInput(input, {user: user});
  tools.startTiming('generateSnarkContract');
  let events = tools.getIpfsJson(input.dhtHash);
  if (events.events[0].data.locationHash) {
    let document = tools.getIpfsJson(events.events[0].data.locationHash);
    tools.displayTiming('getIpfsFile');
    if (document.hD) {
      tools.extendZoKratesFnc(
              input.zToExtendPath, document.hD, input.zExtendedOutPath);
      tools.displayTiming('extendZoKratesFnc');
      let compile = zokrates.compile(user, JSON.stringify({
        filePath: input.zExtendedOutPath,
        outPath: input.compileExtendedOutPath
      }), true);
      tools.displayTiming('compile');
      if (compile.out && compile.outCode) {
        let setup = zokrates.setup(user, JSON.stringify({
          inPath: compile.out,
          provingScheme: input.provingScheme,
          provingKeyPath: input.kPOutPath,
          verificationKeyPath: input.kVOutPath
        }), true);
        tools.displayTiming('setup');
        if (setup.provingKey && setup.verificationKey) {
          let contract = zokrates.exportVerifier(user, JSON.stringify({
            inPath: setup.verificationKey,
            outPath: input.contractOutPath,
            provingScheme: input.provingScheme
          }), true);
          tools.displayTiming('exportVerifier');
          if (contract.solidityContract) {
            zokrates.deployContract(user, JSON.stringify({
              inPath: contract.solidityContract,
              gasLimit: input.gasLimit
            }));
          } else { console.error('Unable to generate contract.'); }
        } else { console.error('Unable to perform setup.'); }
      } else { console.error('Unable to compile extended z.'); }
    } else { console.error('Unable to download ipfs document.'); }
  } else { console.error('Unable to download ipfs event.'); }
};

module.exports.provideProverKey = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  let sproof = new Sproof(Object.assign({credentials: user.credentials},
      global.config.sproof.init));
  input = tools.prepareInput(input, {user: user});
  tools.startTiming('provideProverKey');
  let path = tools.copyAndGzipFile(input.kPPath);
  if (path) {
    let parts = tools.splitFile(path);
    tools.deleteFile(path);
    let storage = {
      partsCnt: 0,
      parts: []
    };
    console.log('Start to upload kP.');
    for (let i = 0; i < parts.length; i++) {
      let kPpart = tools.getSourceFile(parts[i]);
      if (kPpart) {
        sproof.uploadFile(kPpart, (err, res) => {
          if (err) console.error(err);
          else {
            tools.displayTiming('uploadFile_' + i);
            storage.parts[i] = {
              documentHash: sproof.getHash(kPpart),
              locationHash: res.hash
            };
            storage.partsCnt++;
            tools.deleteFile(parts[i]);
            console.log('kP part ' + i + ' uploaded.');
            if (storage.partsCnt === parts.length) {
              console.log('Upload kP done.');
              data = Buffer.from(JSON.stringify({
                kPparts: storage, aC: input.contractAddress }), 'utf8');
              sproof.uploadFile(data, (err, res) => {
                if (err) console.error(err);
                else {
                  tools.displayTiming('uploadFile');
                  console.log('Register kP uploads.');
                  sproof.registerDocument(new Registration({
                    name: input.name,
                    documentHash: sproof.getHash(data),
                    locationHash: res.hash,
                    receivers: [input.addressP]
                  }));
                  sproof.commit((err, res) => {
                    if (err) console.error(err);
                    else {
                      tools.displayTiming('registerDocument');
                      tools.addHistory(
                              control, res, {fnc: 'provideProverKey'});
                      console.log(res);
                      zokrates.monitorVerification(user, JSON.stringify({
                        contractAddress: input.contractAddress,
                        gasLimit: input.gasLimit,
                        contractAbi: input.contractAbi
                      }));
                      console.log('Start monitoring.');
                    }
                  });
                }
              });
            }
          }
        });
      } else { console.error('Unable to read kP part.'); }
    }
  } else { console.error('Unable to split kP in parts.'); }
};

module.exports.verifySnarkProof = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  let sproof = new Sproof(Object.assign({credentials: user.credentials},
      global.config.sproof.init));
  input = tools.prepareInput(input, {user: user});
  tools.startTiming('verifySnarkProof');
  let hD = tools.getWitness(input.documentHashPath);
  if (hD) {
    tools.extendZoKratesFnc(
            input.zToExtendPath, hD, input.zExtendedOutPath);
    tools.displayTiming('extendZoKratesFnc');
    let compile = zokrates.compile(user, JSON.stringify({
      filePath: input.zExtendedOutPath,
      outPath: input.compileExtendedOutPath
    }), true);
    tools.displayTiming('compile');
    if (compile.out && compile.outCode) {
      let witness = zokrates.computeWitness(user, JSON.stringify({
        document: input.document,
        inPath: compile.out,
        outPath: input.witnessOut
      }), true);
      tools.displayTiming('computeWitness');
      if (witness.witnessFile && witness.witness) {
        let events = tools.getIpfsJson(input.dhtHash);
        tools.displayTiming('getIpfsFile');
        if (events.events[0].data.locationHash) {
          let doc = tools.getIpfsJson(
                  events.events[0].data.locationHash);
          if (doc.kPparts.partsCnt && doc.kPparts.parts && doc.aC) {
            let kPgzipPath = tools.getTmpFilePath('.gz');
            for (let i = 0; i < doc.kPparts.partsCnt; i++) {
              let kPpart = tools.getIpfsFile(
                      doc.kPparts.parts[i].locationHash);
              tools.displayTiming('getIpfsFile_' + i);
              if (kPpart && sproof.getHash(kPpart) === 
                      doc.kPparts.parts[i].documentHash)
              {
                if (i === 0) { tools.writeToFile(kPpart, kPgzipPath); }
                else { tools.appendToFile(kPpart, kPgzipPath); }
                console.log('Merged kP part ' + i +'.');
              } else {
                console.error('Unable to download kP part ' + i +'.');
              }
            }
            if (tools.fileExists(kPgzipPath)) {
              let path = tools.copyAndUngzipFile(
                      kPgzipPath, input.kPPath);
              if (path) {
                tools.deleteFile(kPgzipPath);
                console.log('Start generating proof.');
                let proof = zokrates.generateProof(user, JSON.stringify({
                  inPath: compile.out,
                  proofPath: input.proofOutPath,
                  provingScheme: input.provingScheme,
                  provingKeyPath: path,
                  witnessPath: witness.witnessFile
                }), true);
                tools.displayTiming('generateProof');
                if (proof.proof) {
                  console.log('Start verifying proof.');
                  zokrates.submitProof(user, JSON.stringify({
                    inPath: input.proofOutPath,
                    contractAddress: doc.aC,
                    gasLimit: input.gasLimit,
                    contractAbi: input.contractAbi
                  }));
                } else { console.error('Unable to generate proof.'); }
              } else { console.error('Unable to unzip kP.'); }
            } else { console.error('Unable to merge kP parts to kP.'); }
          } else { console.error('Unable to download ipfs document.'); }
        } else { console.error('Unable to download ipfs event.'); }
      } else { console.error('Unable to compute witness.'); }
    } else { console.error('Unable to compile extended z.'); }
  } else { console.error('Unable to load hD.'); }
};

module.exports.sendAttributes = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  let sproof = new Sproof(Object.assign({credentials: user.credentials},
      global.config.sproof.init));
  input = tools.prepareInput(input, {user: user});
  tools.startTiming('sendAttributes');
  let data = sproofUtils.encrypt(input.publicKeyT, {
    x: input.x,
    lower: input.lower,
    upper: input.upper,
    addressV: input.addressV
  });
  tools.displayTiming('encrypt');
  data = Buffer.from(data, 'utf8');
  sproof.uploadFile(data, (err, res) => {
    if (err) console.error(err);
    else {
      tools.displayTiming('uploadFile');
      input.x = input.lower = input.upper = input.addressV = null;
      input = tools.prepareInput(input, {user: user});
      input.documentHash = sproof.getHash(data);
      input.locationHash = res.hash;
      input.receivers = [input.addressT];
      sproof.registerDocument(new Registration(input));
      sproof.commit((err, res) => {
        if (err) console.error(err);
        else {
          tools.displayTiming('registerDocument');
          tools.addHistory(control, res, {fnc: 'sendAttributes'});
          console.log(res);
        }
      });
    }
  });
};

module.exports.generateRangeProof = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  let sproof = new Sproof(Object.assign({credentials: user.credentials},
      global.config.sproof.init));
  input = tools.prepareInput(input, {user: user});
  tools.startTiming('generateRangeProof');
  let events = tools.getIpfsJson(input.dhtHash);
  if (events.events[0].data.locationHash) {
    let cipher = tools.getIpfsFile(events.events[0].data.locationHash)
            .toString();
    if (cipher) {
      try {
        tools.displayTiming('getIpfsFile');
        data = sproofUtils.decrypt(user.credentials.privateKey, cipher);
        if (data.x && data.lower && data.upper && data.addressV) {
          let params = {
            x: data.x,
            lower: data.lower,
            upper: data.upper,
            outPath: input.outPath
          };
          tools.displayTiming('decrypt');
          let res = ing.generateProof(
                  user, JSON.stringify(params), true);
          tools.displayTiming('generateProof');
          let proof = tools.getSourceFile(res.proof);
          if (proof) {
            let message = JSON.stringify({
              lower: data.lower,
              upper: data.upper,
              proof: proof.toString('base64')
            });
            let signature = sproofUtils.sign(
                    message, user.credentials.privateKey);
            tools.displayTiming('sign');
            if (signature.r && signature.s && signature.v) {
              let document = JSON.stringify({
                message: JSON.parse(message),
                signature: signature
              });
              document = Buffer.from(document, 'utf8');
              sproof.uploadFile(document, (err, res) => {
                if (err) console.error(err);
                else {
                  tools.displayTiming('uploadFile');
                  sproof.registerDocument(new Registration({
                    documentHash: sproof.getHash(document),
                    locationHash: res.hash,
                    receivers: [events.from, data.addressV],
                    validFrom: input.validFrom,
                    validUntil: input.validUntil
                  }));
                  sproof.commit((err, res) => {
                    if (err) console.error(err);
                    else {
                      tools.displayTiming('registerDocument');
                      tools.addHistory(control, res, {
                        fnc: 'generateRangeProof'});
                      console.log(res);
                    }
                  });
                }
              });
            } else { console.error('Unable to sign document.'); }
          } else { console.error('Unable to generate proof.'); }
        } else { console.error('Unable to load ipfs data.'); }
      } catch (err) { console.error(err.message); }
    } else { console.error('Unable to download ipfs document.'); }
  } else { console.error('Unable to download ipfs event.'); }
};

module.exports.verifyRangeProof = function (user, input) {
  if (!tools.isEmpty(input)) input = JSON.parse(unescape(input));
  else { console.error('Missing input params.'); return; }
  input = tools.prepareInput(input, {user: user});
  tools.startTiming('verifyRangeProof');
  let events = tools.getIpfsJson(input.dhtHash);
  if (events.events[0].data.locationHash) {
    let document = tools.getIpfsFile(events.events[0].data.locationHash)
            .toString();
    if (document) {
      try {
        tools.displayTiming('getIpfsFile');
        document = JSON.parse(document.toString());
        let valid = sproofUtils.verify(JSON.stringify(document.message),
                document.signature, input.addressT);
        tools.displayTiming('verify');
        if (valid) {
          let res = {
            verification: false,
            lower: document.message.lower,
            upper: document.message.upper
          };
          tools.writeToFile(Buffer.from(
                  document.message.proof, 'base64'), input.inPath);
          res.verification = ing.verifyProof(
                  user, JSON.stringify({inPath: input.inPath}), true);
          tools.displayTiming('verifyProof');
          tools.addHistory(control, res, {fnc: 'verifyRangeProof'});
          console.log(res);
        } else { console.error('Unable to verify signature.'); }
      } catch (err) { console.error(err.message); }
    } else { console.error('Unable to download ipfs document.'); }
  } else { console.error('Unable to download ipfs event.'); }
};

module.exports.showHistory = function () {
  global.body.history = tools.getHistory(control);
};

module.exports.deleteHistory = function () {
  global.history[control] = {};
};