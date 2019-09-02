/**
 * Config file for node interface and controls.
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
const secretConfig = require('./secret-config.js');

let config = {
  users: {
    prover: [ {
        name: 'Prover/Receiver I',
        id: '0xbd6a98b7',
        role: 'prover',
        credentials: secretConfig.users.prover[0].credentials
      }, {
        name: 'Prover/Receiver II',
        id: '0xb844beda',
        role: 'prover',
        credentials: secretConfig.users.prover[1].credentials
      }
    ],
    verifier: [ {
        name: 'Verifier I',
        id: '0x8ddf0110',
        role: 'verifier',
        credentials: secretConfig.users.verifier[0].credentials
      }, {
        name: 'Verifier II',
        id: '0x6d18fc92',
        role: 'verifier',
        credentials: secretConfig.users.verifier[1].credentials
      }
    ],
    issuer: [ {
        name: 'Issuer I',
        id: '0x9b7db17c',
        role: 'issuer',
        credentials: secretConfig.users.issuer[0].credentials
      }, {
        name: 'Issuer II',
        id: '0x61648e2c',
        role: 'issuer',
        credentials: secretConfig.users.issuer[1].credentials
      }
    ]
  },
  node: {
    server: {
      portProver: 2048,
      portVerifier: 4096,
      portIssuer: 8192
    },
    web3: {
      endpoint: 'wss://ropsten.infura.io/ws/v3/' +
              secretConfig.infura.projectId,
      chain: 'ropsten',
      hardfork: 'petersburg',
      waitConfirmations: 1,
      local: {
        endpoint: 'http://0.0.0.0:8545',
        provider: 'http'
      }
    },
    exec: {
      maxBuffer: 1024 * 1024 * 32
    },
    tmp: {
      path: 'tmp'
    },
    timing: {
      display: true
    }
  },
  sproof: {
    init: {
      uri: 'https://api.sproof.io/',
      chainId: '3',
      chain: 'ethereum',
      version: '0.42'
    },
    ipfs: 'https://ipfs.sproof.io/ipfs/'
  },
  zokrates: {
    executablePath: 'ZoKrates\\zokrates.exe',
    environmentVar: '%ZOKRATES_HOME%'
  },
  ing: {
    executablePath: 'ING\\zkrp.exe'
  },
  home: {
    fnc: {
      idm: {
        text: 'SPROOF IDM',
        title: 'Change to identity management view.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?',
        input: {}
      },
      snark: {
        text: 'ZoKrates ZK-SNARK',
        title: 'Change to ZK-SNARK view.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/snark?',
        input: {}
      },
      zkrp: {
        text: 'ING ZKRP',
        title: 'Change to ZK range proof view.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/zkrp?',
        input: {}
      }
    }
  },
  idm: {
    fnc: {
      getBalance: {
        text: 'Get Balance',
        title: 'Display balance of selected account.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=getBalance',
        input: {}
      },
      ethTransfer: {
        text: 'ETH Transfer',
        title: 'Transfer ETH from selected account.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=ethTransfer',
        input: {
          to: secretConfig.users.issuer[0].credentials.address,
          value: 0.1,
          gasLimit: 22000
        }
      },
      newAccount: {
        text: 'New Account',
        title: 'Create new sproof eth account or display credentials.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=newAccount',
        input: {
          createNewAccount: false
        }
      },
      registerProfile: {
        text: 'Register Profile',
        title: 'Register a new sproof profile with account data.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=registerProfile',
        input: {
          name: 'user.name', // Gets replaced with current user name.
          profileText: 'ZKP Demo'
        }
      },
      updateProfile: {
        text: 'Update Profile',
        title: 'Updates registered sproof profile.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=updateProfile',
        input: {
          name: 'user.name' // Gets replaced with current user name.
        }
      },
      getProfiles: {
        text: 'Get Profiles',
        title: 'Returns profiles or specific profile if id is set.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=getProfiles',
        input: {
          id: 'user.credentials.address', // Gets replaced.
          per_page: null,
          page: null
        }
      },
      getTransactions: {
        text: 'Get Transactions',
        title: 'Returns transactions or specific trans. if id is set.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=getTransactions',
        input: {
          id: null,
          per_page: 10,
          page: null
        }
      },
      getEvents: {
        text: 'Get Events',
        title: 'Returns events or specific event if id is set.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=getEvents',
        input: {
          id: null,
          per_page: 10,
          page: null
        }
      },
      getRegistrations: {
        text: 'Get Registrations',
        title: 'Returns registrations or specific reg. if id is set.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=getRegistrations',
        input: {
          id: null,
          per_page: 10,
          page: null
        }
      },
      getValidation: {
        text: 'Get Validation',
        title: 'Returns validation for given document hash.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=getValidation',
        input: {
          id: ''
        }
      },
      restoreCredentials: {
        text: 'Restore Credentials',
        title: 'Returns user credentials.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=restoreCredentials',
        input: {
          mnemonicSproofCode: ''
        }
      },
      provideDocumentHash: {
        text: 'Provide SNARK Document Hash',
        title: 'Sends the document hash to receiver.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=provideDocumentHash',
        input: {
          zPath: 'ZoKrates\\z.code',
          compileOutPath: 'ZoKrates\\compiled_z_P',
          document: '0x994fac1ca52fdc13abbe567b4ecdc5e1c4a689dff754ae8b05c133cd358245caf9398d97be16765a08c991a20a2a876e734530bee2daa9d639ad8019a0bca127', // Provide SHA-512 hash of document.
          documentHashOutPath: 'ZoKrates\\hD_P.hash',
          name: 'Document Hash',
          addressV: '' // Provide receiver Ethereum address of verifying entity.
        }
      },
      generateSnarkContract: {
        text: 'Generate SNARK Smart Contract',
        title: 'Creates and provides the smart contract.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=generateSnarkContract',
        input: {
          dhtHash: '', // Provide IPFS location id of registered SPROOF document of document hash.
          zToExtendPath: 'ZoKrates\\z_to_extend.code',
          zExtendedOutPath: 'ZoKrates\\z_extended_V.code',
          compileExtendedOutPath: 'ZoKrates\\z_extended_V',
          provingScheme: 'G16',
          kPOutPath: 'ZoKrates\\proving_V.key',
          kVOutPath: 'ZoKrates\\verifying.key',
          contractOutPath: 'ZoKrates\\C.sol',
          gasLimit: 3000000
        }
      },
      provideProverKey: {
        text: 'Provide SNARK Prover Key',
        title: 'Provides prover key and monitores contract execution.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=provideProverKey',
        input: {
          kPPath: 'ZoKrates\\proving_V.key',
          contractAddress: '', // Provide Ethereum smart contract address of SNARK proof.
          name: 'Prover Key',
          addressP: '', // Provide Ethereum address of prover.
          gasLimit: 3000000,
          contractAbi: [{"constant":false,"inputs":[{"name":"a","type":"uint256[2]"},{"name":"b","type":"uint256[2][2]"},{"name":"c","type":"uint256[2]"},{"name":"input","type":"uint256[1]"}],"name":"verifyTx","outputs":[{"name":"r","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"s","type":"string"}],"name":"Verified","type":"event"}]
        }
      },
      verifySnarkProof: {
        text: 'Verify SNARK Proof',
        title: 'Generates SNARK proof and executes contract to verify.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=verifySnarkProof',
        input: {
          dhtHash: '', // Provide IPFS location id of registered SPROOF document of prover key.
          documentHashPath: 'ZoKrates\\hD_P.hash',
          zToExtendPath: 'ZoKrates\\z_to_extend.code',
          zExtendedOutPath: 'ZoKrates\\z_extended_P.code',
          compileExtendedOutPath: 'ZoKrates\\z_extended_P',
          document: '0x994fac1ca52fdc13abbe567b4ecdc5e1c4a689dff754ae8b05c133cd358245caf9398d97be16765a08c991a20a2a876e734530bee2daa9d639ad8019a0bca127', // Provide SHA-512 hash of document.
          witnessOut: 'ZoKrates\\witness',
          proofOutPath: 'ZoKrates\\proof.json',
          provingScheme: 'G16',
          kPPath: 'ZoKrates\\proving_P.key',
          gasLimit: 3000000,
          contractAbi: [{"constant":false,"inputs":[{"name":"a","type":"uint256[2]"},{"name":"b","type":"uint256[2][2]"},{"name":"c","type":"uint256[2]"},{"name":"input","type":"uint256[1]"}],"name":"verifyTx","outputs":[{"name":"r","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"s","type":"string"}],"name":"Verified","type":"event"}]
        }
      },
      sendAttributes: {
        text: 'Send Range Proof Attributes',
        title: 'Define and send attributes for range proof to receiver.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=sendAttributes',
        input: {
          name: 'Range Proof',
          addressT: '', // Provide Ethereum address of trusted entity to generate range proof.
          publicKeyT: '', // Provide SPROOF public key of trusted entity to generate range proof.
          addressV: '', // Provide Ethereum address of range proof verifier.
          x: '30', // Value to proof.
          lower: '18', // Lower bound of range.
          upper: '65', // Upper bound of range.
          validFrom: 'undefined',
          validUntil: 'undefined'
        }
      },
      generateRangeProof: {
        text: 'Generate Range Proof',
        title: 'Generates the range proof and returns it to prover.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=generateRangeProof',
        input: {
          dhtHash: '', // Provide IPFS location id of registered SPROOF document of attributes for range proof.
          outPath: 'ING\\proof.json',
          validFrom: 'undefined',
          validUntil: 'undefined'
        }
      },
      verifyRangeProof: {
        text: 'Verify Range Proof',
        title: 'Verifies the range proof.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/idm?fnc=verifyRangeProof',
        input: {
          inPath: 'ING\\proof_to_verify.json',
          dhtHash: '', // Provide IPFS location id of registered SPROOF document of range proof.
          addressT: '' // Provide Ethereum address of trusted entity which generated range proof.
        }
      }
    }
  },
  snark: {
    fnc: {
      getBalance: {
        text: 'Get Balance',
        title: 'Display balance of selected account.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/snark?fnc=getBalance',
        input: {}
      },
      ethTransfer: {
        text: 'ETH Transfer',
        title: 'Transfer ETH from selected account.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/snark?fnc=ethTransfer',
        input: {
          to: secretConfig.users.issuer[0].credentials.address,
          value: 0.1,
          gasLimit: 22000
        }
      },
      compile: {
        text: 'Compile',
        title: 'Compiles ZoKrates representation of arithmetic circuit.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/snark?fnc=compile',
        input: {
          filePath: 'ZoKrates\\preImageHash.code',
          outPath: 'ZoKrates\\out'
        }
      },
      computeWitness: {
        text: 'Compute Witness',
        title: 'Computes a witness for the compiled program.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/snark?fnc=computeWitness',
        input: {
          document: '0x994fac1ca52fdc13abbe567b4ecdc5e1c4a689dff754ae8b05c133cd358245caf9398d97be16765a08c991a20a2a876e734530bee2daa9d639ad8019a0bca127', // Provide SHA-512 hash of document.
          inPath: 'ZoKrates\\out',
          outPath: 'ZoKrates\\witness'
        }
      },
      setup: {
        text: 'Setup',
        title: 'Generates a trusted setup for the compiled program.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/snark?fnc=setup',
        input: {
          inPath: 'ZoKrates\\out',
          provingScheme: 'G16',
          provingKeyPath: 'ZoKrates\\proving.key',
          verificationKeyPath: 'ZoKrates\\verification.key'
        }
      },
      exportVerifier: {
        text: 'Export Verifier',
        title: 'Creates a verifier contract using the verification key.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/snark?fnc=exportVerifier',
        input: {
          inPath: 'ZoKrates\\verification.key',
          outPath: 'ZoKrates\\verifier.sol',
          provingScheme: 'G16'
        }
      },
      deployContract: {
        text: 'Deploy Contract',
        title: 'Compiles and deploys ZK-SNARK proof solidity contract.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/snark?fnc=deployContract',
        input: {
          inPath: 'ZoKrates\\verifier.sol',
          gasLimit: 3000000
        }
      },
      monitorVerification: {
        text: 'Monitor Verification',
        title: 'Monitors the verification of the smart contract.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/snark?fnc=monitorVerification',
        input: {
          contractAddress: '', // Provide Ethereum smart contract address of SNARK proof.
          gasLimit: 3000000,
          contractAbi: [{"constant":false,"inputs":[{"name":"a","type":"uint256[2]"},{"name":"b","type":"uint256[2][2]"},{"name":"c","type":"uint256[2]"},{"name":"input","type":"uint256[1]"}],"name":"verifyTx","outputs":[{"name":"r","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"s","type":"string"}],"name":"Verified","type":"event"}]
        }
      },
      generateProof: {
        text: 'Generate Proof',
        title: 'Generates a proof using the proving key.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/snark?fnc=generateProof',
        input: {
          inPath: 'ZoKrates\\out',
          proofPath: 'ZoKrates\\proof.json',
          provingScheme: 'G16',
          provingKeyPath: 'ZoKrates\\proving.key',
          witnessPath: 'ZoKrates\\witness'
        }
      },
      submitProof: {
        text: 'Submit Proof',
        title: 'Submit the proof by calling verifyTx of contract.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/snark?fnc=submitProof',
        input: {
          inPath: 'ZoKrates\\proof.json',
          contractAddress: '', // Provide Ethereum smart contract address of SNARK proof.
          gasLimit: 3000000,
          contractAbi: [{"constant":false,"inputs":[{"name":"a","type":"uint256[2]"},{"name":"b","type":"uint256[2][2]"},{"name":"c","type":"uint256[2]"},{"name":"input","type":"uint256[1]"}],"name":"verifyTx","outputs":[{"name":"r","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"s","type":"string"}],"name":"Verified","type":"event"}]
        }
      }
    }
  },
  zkrp: {
    fnc: {
      getBalance: {
        text: 'Get Balance',
        title: 'Display balance of selected account.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/zkrp?fnc=getBalance',
        input: {}
      },
      ethTransfer: {
        text: 'ETH Transfer',
        title: 'Transfer ETH from selected account.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/zkrp?fnc=ethTransfer',
        input: {
          to: secretConfig.users.issuer[0].credentials.address,
          value: 0.1,
          gasLimit: 22000
        }
      },
      generateProof: {
        text: 'Generate Proof',
        title: 'Generates a range proof.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/zkrp?fnc=generateProof',
        input: {
          x: '30', // Value to proof.
          lower: '18', // Lower bound of range.
          upper: '65', // Upper bound of range.
          outPath: 'ING\\proof.json'
        }
      },
      verifyProof: {
        text: 'Verify Proof',
        title: 'Verifies a range proof.',
        roles: [ 'prover', 'verifier', 'issuer' ],
        href: '/zkrp?fnc=verifyProof',
        input: {
          inPath: 'ING\\proof.json'
        }
      }
    }
  }
};
module.exports = config;