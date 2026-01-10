import { ethers } from 'ethers';
import contractABI from '../../blockchain/contracts/VerifiableCredentials.json';

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
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
}

export async function issueCredential(hash) {
  const contract = getContract();
  const tx = await contract.issueCredential(hash);
  await tx.wait();
}

export async function verifyCredential(hash) {
  const contract = getContract();
  return contract.verifyCredential(hash);
}
