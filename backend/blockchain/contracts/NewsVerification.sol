// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NewsVerification
 * @dev Decentralized, tamper-proof repository for multi-modal fake news detection results.
 */
contract NewsVerification {
    address public owner;
    uint256 public totalRecords;

    struct NewsRecord {
        bytes32 newsHash;          // SHA-256 or Keccak-256 of raw news content
        string contentTitle;       // Title or headline
        string mediaType;          // text, image, audio, video
        string verdict;            // REAL, FAKE, UNVERIFIED
        uint256 fakePercentage;    // 0 - 100
        uint256 realPercentage;    // 0 - 100
        uint256 confidence;        // 0 - 100
        uint256 timestamp;         // Unix timestamp
        address verifier;          // Address of analyzer/signer
        string metadataUri;        // IPFS/Storage URI or summary hash
        bool exists;
    }

    // Mapping from news hash to its verification record
    mapping(bytes32 => NewsRecord) private records;
    bytes32[] private recordHashes;

    event NewsVerified(
        bytes32 indexed newsHash,
        string verdict,
        uint256 fakePercentage,
        uint256 realPercentage,
        uint256 confidence,
        uint256 timestamp,
        address verifier
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute");
        _;
    }

    constructor() {
        owner = msg.sender;
        totalRecords = 0;
    }

    /**
     * @dev Record a verified news item on-chain
     */
    function recordVerification(
        bytes32 _newsHash,
        string memory _title,
        string memory _mediaType,
        string memory _verdict,
        uint256 _fakePercentage,
        uint256 _realPercentage,
        uint256 _confidence,
        string memory _metadataUri
    ) public returns (bool) {
        require(_newsHash != bytes32(0), "Invalid news hash");
        require(_fakePercentage + _realPercentage <= 100, "Probabilities invalid");

        if (!records[_newsHash].exists) {
            recordHashes.push(_newsHash);
            totalRecords++;
        }

        records[_newsHash] = NewsRecord({
            newsHash: _newsHash,
            contentTitle: _title,
            mediaType: _mediaType,
            verdict: _verdict,
            fakePercentage: _fakePercentage,
            realPercentage: _realPercentage,
            confidence: _confidence,
            timestamp: block.timestamp,
            verifier: msg.sender,
            metadataUri: _metadataUri,
            exists: true
        });

        emit NewsVerified(
            _newsHash,
            _verdict,
            _fakePercentage,
            _realPercentage,
            _confidence,
            block.timestamp,
            msg.sender
        );

        return true;
    }

    /**
     * @dev Fetch a verification record by content hash
     */
    function getRecord(bytes32 _newsHash)
        external
        view
        returns (
            bytes32 newsHash,
            string memory contentTitle,
            string memory mediaType,
            string memory verdict,
            uint256 fakePercentage,
            uint256 realPercentage,
            uint256 confidence,
            uint256 timestamp,
            address verifier,
            string memory metadataUri,
            bool exists
        )
    {
        NewsRecord memory r = records[_newsHash];
        return (
            r.newsHash,
            r.contentTitle,
            r.mediaType,
            r.verdict,
            r.fakePercentage,
            r.realPercentage,
            r.confidence,
            r.timestamp,
            r.verifier,
            r.metadataUri,
            r.exists
        );
    }

    /**
     * @dev Check if a given content hash exists on-chain and compare
     */
    function verifyHashMatch(bytes32 _calculatedHash, bytes32 _storedHash)
        external
        pure
        returns (bool isMatch)
    {
        return (_calculatedHash == _storedHash);
    }

    /**
     * @dev Get all recorded hashes
     */
    function getAllHashes() external view returns (bytes32[] memory) {
        return recordHashes;
    }
}
