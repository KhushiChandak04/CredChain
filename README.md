
# 🛡️ CredChain: Decentralized Verifiable Credentials

<p align="center">
	<img src="https://img.shields.io/badge/Hardhat-3.0-blue?logo=hardhat" alt="Hardhat"/>
	<img src="https://img.shields.io/badge/Solidity-0.8.28-black?logo=solidity" alt="Solidity"/>
	<img src="https://img.shields.io/badge/Ethers.js-5.x-purple?logo=ethereum" alt="Ethers.js"/>
	<img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js"/>
	<img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React"/>
	<img src="https://img.shields.io/badge/IPFS-Storage-blue?logo=ipfs" alt="IPFS"/>
</p>

---

## 🌟 Project Overview

CredChain is a decentralized platform for issuing, storing, and verifying digital credentials on the blockchain. It enables organizations to issue tamper-proof credentials, and allows anyone to verify their authenticity instantly. The system leverages Ethereum smart contracts, IPFS for decentralized storage, and a modern React/Next.js frontend for seamless user experience.

**Key Features:**
- Issue verifiable credentials securely
- Prevents duplicate credentials
- Public, trustless verification
- Decentralized storage with IPFS
- User-friendly web interface

---

## 🛠️ Tech Stack

<p>
	<img src="https://img.shields.io/badge/Hardhat-3.0-blue?logo=hardhat" alt="Hardhat"/>
	<img src="https://img.shields.io/badge/Solidity-0.8.28-black?logo=solidity" alt="Solidity"/>
	<img src="https://img.shields.io/badge/Ethers.js-5.x-purple?logo=ethereum" alt="Ethers.js"/>
	<img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js"/>
	<img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React"/>
	<img src="https://img.shields.io/badge/IPFS-Storage-blue?logo=ipfs" alt="IPFS"/>
</p>

- **Hardhat 3** (Solidity development)
- **Solidity 0.8.x** (Smart contracts)
- **Ethers.js** (Blockchain interaction)
- **dotenv** (Environment variables)
- **Next.js 14** (Frontend)
- **React 18** (UI)
- **IPFS** (Decentralized storage)

---

## ⚡ Quick Start

### 1. Clone the Repository
```sh
git clone https://github.com/yourusername/CredChain.git
cd CredChain
```

### 2. Blockchain Setup (Hardhat)
```sh
cd blockchain
npm install
npx hardhat compile
# Deploy to Sepolia (update .env first)
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Frontend Setup (Next.js)
```sh
cd ../frontend
npm install
npm run dev
```

---

## 📝 Useful Commands

### Blockchain
- Compile contracts: `npx hardhat compile`
- Run tests: `npx hardhat test`
- Deploy to Sepolia: `npx hardhat run scripts/deploy.js --network sepolia`

### Frontend
- Start dev server: `npm run dev`

---

## 📂 Project Structure

```
CredChain/
	blockchain/   # Hardhat backend
	frontend/     # Next.js frontend
```

---

## 📄 Original Hardhat 3 Beta Info

