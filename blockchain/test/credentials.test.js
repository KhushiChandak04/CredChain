const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VerifiableCredentials", function () {
  it("Should issue and verify a credential", async function () {
    const [issuer] = await ethers.getSigners();
    const VerifiableCredentials = await ethers.getContractFactory("VerifiableCredentials");
    const contract = await VerifiableCredentials.deploy();
    await contract.deployed();

    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("credential-data"));
    await contract.issueCredential(hash);
    expect(await contract.verifyCredential(hash)).to.equal(true);
  });
});
