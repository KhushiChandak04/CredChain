import hre from "hardhat";

async function main() {
  const VerifiableCredentials = await hre.ethers.getContractFactory("VerifiableCredentials");
  const contract = await VerifiableCredentials.deploy();
  await contract.deployed();
  console.log("VerifiableCredentials deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
