// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerifiableCredentials {
    struct Credential {
        address issuer;
        bytes32 hash;
        uint256 issuedAt;
    }

    mapping(bytes32 => Credential) public credentials;

    event CredentialIssued(address indexed issuer, bytes32 indexed hash, uint256 issuedAt);

    function issueCredential(bytes32 hash) external {
        require(credentials[hash].issuedAt == 0, "Credential already issued");
        credentials[hash] = Credential(msg.sender, hash, block.timestamp);
        emit CredentialIssued(msg.sender, hash, block.timestamp);
    }

    function verifyCredential(bytes32 hash) external view returns (bool) {
        return credentials[hash].issuedAt != 0;
    }
}
