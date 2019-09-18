# Blockchain and Trusted Decentralized Identity: Zero-Knowledge Proof of Identity for Attribute-Based Self-Sovereign Identity Management

This repository contains code of a prototype implementation of a decentralized privacy-preserving identity management system with zero knowledge proofs of identity based on blockchain technology.
A protocol for **secure document exchange**, Zero-Knowledge **SNARK proofs** and Zero-Knowledge **Bulletproofs** are combined to form a complete system.
The implementation is based on the following open source projects:
* Protokoll for managing digital documents [SPROOF](https://github.com/sproof)
* Toolbox for creating and verifying SNARK proofs on Ethereum [ZoKrates](https://github.com/Zokrates/ZoKrates)
* Library for creating and verifying Bulletproofs [ING-Bank ZKRP](https://github.com/ing-bank/zkrp)

**Thanks to the developers for creating these awesome components and making them available to the community!**

## Short usage guide

The project was created on a Windows operating system. Therefore, the SNARK proof and Bulletproof executables are only included for Windows 64Bit.
Before the ZoKrates toolbox can be used, an environment variable with the name ZOKRATES_HOME and the absolute path to the stdlib folder contained in the toolbox must be defined.

### Install node packages

Download the required packages.

```
$ npm install
```

### Create SPROOF account

Create at least one [SPROOF account](https://app.sproof.io/#/signup) and define the credentials for any role in secret-config.js.

```
address: '',
publicKey: '',
sproofCode: ''
```

### Create Infura account

Create an [Infura project](https://infura.io/) and add the project id of ropsten testnet to the secret-config.js.

```
infura: {
  projectId: ''
}
```

### Start node server

Start the node server for the role of interest (where credentials are configured). Possible roles are prover, verifier or issuer.

```
$ node index.p.js
```

Open the application with the given port in a browser window.

```
http://127.0.0.1:2048
```

### Finish configuration

Execute "Restore Credentials" in the "SPROOF IDM" section of the application and add the private key of the role to the secret-config.js.

```
privateKey: ''
```

### Run application

Restart the node server and perform SNARK proofs and Bulletproofs.
