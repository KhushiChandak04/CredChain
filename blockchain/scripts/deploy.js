import hre from "hardhat";

async function main() {
  const VerifiableCredentials = await hre.ethers.getContractFactory("VerifiableCredentials");
  const contract = await VerifiableCredentials.deploy();
  await contract.waitForDeployment();
  console.log("VerifiableCredentials deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
