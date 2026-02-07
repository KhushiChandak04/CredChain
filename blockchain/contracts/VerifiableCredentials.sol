// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerifiableCredentials {
    struct Credential {
        address issuer;
        bytes32 hash;
        uint256 issuedAt;
    }

    mapping(bytes32 => Credential) public credentials;

    mapping(address => bool) public whitelistedIssuers;
    address public owner;

    event CredentialIssued(address indexed issuer, bytes32 indexed hash, uint256 issuedAt);

    modifier onlyIssuer() {
        require(whitelistedIssuers[msg.sender], "Not whitelisted");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        whitelistedIssuers[msg.sender] = true;
    }

    function addIssuer(address _issuer) external onlyOwner {
        whitelistedIssuers[_issuer] = true;
    }

    function issueCredential(bytes32 hash) external onlyIssuer {
        require(credentials[hash].issuedAt == 0, "Credential already issued");
        credentials[hash] = Credential(msg.sender, hash, block.timestamp);
        emit CredentialIssued(msg.sender, hash, block.timestamp);
    }

    function verifyCredential(bytes32 hash) external view returns (bool) {
        return credentials[hash].issuedAt != 0;
    }
}
