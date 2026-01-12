// Ensure MetaMask is on Sepolia before any transaction
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex

export async function ensureSepoliaNetwork() {
  if (!window.ethereum) {
    alert("MetaMask not found");
    throw new Error("MetaMask not found");
  }
  const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
  if (currentChainId !== SEPOLIA_CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID,
              chainName: "Sepolia Test Network",
              nativeCurrency: {
                name: "SepoliaETH",
                symbol: "SepETH",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  }
}
import { ethers } from 'ethers';
import contractArtifact from '../../blockchain/artifacts/contracts/VerifiableCredentials.sol/VerifiableCredentials.json';
const contractABI = contractArtifact.abi;

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }

  return null;
}

export function getContract() {
  const provider = getProvider();
  if (!provider) throw new Error('No provider');
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
}

export async function issueCredential(hash) {
  await ensureSepoliaNetwork();
  const contract = getContract();
  const tx = await contract.issueCredential(hash);
  await tx.wait();
}

export async function verifyCredential(hash) {
  await ensureSepoliaNetwork();
  const contract = getContract();
  return contract.verifyCredential(hash);
}
