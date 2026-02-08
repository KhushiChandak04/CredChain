# CredChain

> Decentralized credential issuance and verification on Ethereum.

<p align="center">
  <img src="https://img.shields.io/badge/Solidity-0.8.x-363636?logo=solidity" alt="Solidity" />
  <img src="https://img.shields.io/badge/Hardhat-Tooling-FFF100?logo=hardhat&logoColor=000" alt="Hardhat" />
  <img src="https://img.shields.io/badge/Next.js-13-000?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=000" alt="React" />
  <img src="https://img.shields.io/badge/Ethers.js-5.x-7B3FE4?logo=ethereum" alt="Ethers.js" />
  <img src="https://img.shields.io/badge/IPFS-Pinata-00B4D8?logo=ipfs" alt="IPFS" />
  <img src="https://img.shields.io/badge/Network-Sepolia-blue" alt="Sepolia" />
</p>

---

## Overview

CredChain enables organisations to **issue tamper-proof digital credentials** (certificates, transcripts, badges) and allows anyone to **verify** them instantly — all without a central authority.

| Capability | How it works |
|---|---|
| **Issue** | Upload a file → pin to IPFS → SHA-256 hash stored on-chain |
| **Verify** | Upload the same file → hash is recomputed and checked against the smart contract |
| **Access control** | Only addresses on the on-chain whitelist can issue credentials |
| **Privacy** | No raw files are stored on-chain — only cryptographic hashes |

**Live demo →** [credchain-puce.vercel.app](https://credchain-puce.vercel.app)

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│                                                              │
│  index.js ── issue.js ── verify.js                           │
│       │          │            │                               │
│       │    IssueCredForm  VerifyCredForm                     │
│       │          │            │                               │
│       ▼          ▼            ▼                               │
│  ┌──────────────────────────────────┐                        │
│  │  utils/                          │                        │
│  │  ├─ contract.js  (ethers.js v5)  │                        │
│  │  ├─ hash.js      (Web Crypto)    │                        │
│  │  └─ ipfs.js      (→ /api/upload) │                        │
│  └──────────────────────────────────┘                        │
│               │                    │                          │
│               ▼                    ▼                          │
│     /api/upload (Pinata)    MetaMask (Sepolia)                │
└──────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
              ┌──────────────────────────────┐
              │  VerifiableCredentials.sol    │
              │  (Sepolia Testnet)           │
              │                              │
              │  • whitelistedIssuers map    │
              │  • credentials map           │
              │  • issueCredential(bytes32)  │
              │  • verifyCredential(bytes32) │
              └──────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Smart Contract** | Solidity 0.8.x | Credential storage & access control |
| **Development** | Hardhat | Compile, test, deploy |
| **Frontend** | Next.js 13 (Pages Router) | SSR + API routes |
| **UI** | React 18 | Component-based interface |
| **Blockchain SDK** | Ethers.js 5.x | Contract interaction via MetaMask |
| **File Storage** | IPFS via Pinata | Decentralised document pinning |
| **Wallet** | MetaMask | User authentication & tx signing |
| **Hosting** | Vercel | Zero-config deployment |
| **Testnet** | Sepolia | Ethereum test network |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 16
- **MetaMask** browser extension
- **Sepolia testnet ETH** ([faucet](https://sepoliafaucet.com))
- **Pinata** account for IPFS ([pinata.cloud](https://www.pinata.cloud))

### 1 · Clone

```sh
git clone https://github.com/KhushiChandak04/CredChain.git
cd CredChain
```

### 2 · Smart Contract

```sh
cd blockchain
npm install
```

Create `blockchain/.env`:

```env
SEPOLIA_RPC_URL=<your-sepolia-rpc-url>
PRIVATE_KEY=<deployer-wallet-private-key>
```

```sh
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network sepolia
```

Note the deployed contract address from the console output.

### 3 · Frontend

```sh
cd ../frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed-contract-address>
PINATA_API_KEY=<your-pinata-api-key>
PINATA_API_SECRET=<your-pinata-api-secret>
PINATA_JWT=<your-pinata-jwt>
```

```sh
npm run dev          # http://localhost:3000
```

### 4 · Add an Issuer

Only whitelisted wallets can issue credentials. After deploying:

```sh
cd blockchain
npx hardhat run scripts/addIssuer.js --network sepolia
```

Edit `scripts/addIssuer.js` to set the address you want to whitelist.

---

## How It Works

### Issuing a Credential

1. Connect MetaMask (must be a whitelisted issuer on Sepolia)
2. Upload a credential file (PDF, image, etc.)
3. File is uploaded to IPFS via server-side Pinata API
4. SHA-256 hash is computed client-side using Web Crypto API
5. Hash is submitted to the smart contract via a MetaMask transaction
6. Credential is now permanently recorded on-chain

### Verifying a Credential

1. Connect MetaMask to Sepolia
2. Upload the credential file to verify
3. SHA-256 hash is recomputed client-side
4. Hash is checked against the smart contract (read-only, no gas)
5. If found: issuer address, timestamp, and hash are displayed
6. If not found: credential is marked as unverified

---

## Smart Contract

The `VerifiableCredentials` contract provides:

| Function | Access | Description |
|---|---|---|
| `issueCredential(bytes32)` | Whitelisted issuers | Stores a credential hash on-chain |
| `verifyCredential(bytes32)` | Public (view) | Returns credential data for a hash |
| `addIssuer(address)` | Owner only | Whitelists an issuer address |
| `removeIssuer(address)` | Owner only | Removes an issuer from whitelist |

Credentials are stored as:

```solidity
struct Credential {
    address issuer;
    bytes32 hash;
    uint256 issuedAt;
}
```

---

## Deployment

The frontend is deployed on **Vercel** with zero configuration:

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add environment variables in Vercel dashboard
5. Deploy — Vercel auto-detects Next.js

---

## Security Notes

- **No raw files on-chain** — only SHA-256 hashes are stored
- **Pinata JWT is server-side only** — never exposed to the browser
- **File uploads are validated** — 10 MB limit, file type whitelist, temp file cleanup
- **Error messages are sanitised** — no internal details leak to users
- **Access control** — only whitelisted addresses can issue credentials
- **Environment variables** — all secrets are in `.env` / `.env.local` (gitignored)

---

## License

MIT
