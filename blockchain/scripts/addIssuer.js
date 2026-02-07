import hre from "hardhat";

async function main() {
  const contractAddress = process.env.VC_CONTRACT_ADDRESS;
  const issuer = "0xa34596a17e45cac6829cbc8f6d678a119695ee4d";
  if (!contractAddress) {
    throw new Error("VC_CONTRACT_ADDRESS env var not set");
  }
  const VerifiableCredentials = await hre.ethers.getContractFactory("VerifiableCredentials");
  const contract = VerifiableCredentials.attach(contractAddress);
  const tx = await contract.addIssuer(issuer);
  await tx.wait();
  console.log("Issuer added:", issuer);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
