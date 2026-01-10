# CredChain

CredChain is a decentralized, blockchain-based credential verification system that enables issuers to issue tamper-proof credentials and allows third parties to verify them without relying on a central authority.

## Features
- Smart contract-based credential issuance and verification
- Privacy-preserving design (no personal data stored on-chain)
- IPFS-based decentralized storage
- Wallet-based authentication using MetaMask
- Simple issuer and verifier dashboards

## Tech Stack
- Solidity smart contracts (Ethereum Sepolia, Hardhat)
- Next.js frontend
- ethers.js for blockchain interaction
- IPFS (Pinata/Web3.Storage) for off-chain storage

## Project Structure
```
blockchain/
  contracts/
    VerifiableCredentials.sol
  scripts/
    deploy.js
  test/
    credentials.test.js
  hardhat.config.js
  package.json
frontend/
  pages/
    index.js
    issue.js
    verify.js
  components/
    WalletConnect.js
    IssueCredentialForm.js
    VerifyCredentialForm.js
  utils/
    contract.js
    ipfs.js
    hash.js
  styles/
    globals.css
  package.json
.env.example
README.md
.gitignore
```

## Getting Started
See each subfolder for setup instructions.
