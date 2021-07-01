// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./cERC20.sol";

contract EstateToken is ERC721 {

    using Counters for Counters.Counter;
    using Strings for uint;

    Counters.Counter tokenId;
    mapping(uint256 => string) tokenURIs;
    mapping(string => uint8) tokenCheck;
    mapping(uint256 => address) tokenContracts;
    
    string baseURI = "";

    constructor() ERC721("Estate", "EST") {}

    function setTokenURI(uint256 _tokenId, string memory _tokenURI) private {
        tokenURIs[_tokenId] = _tokenURI;
    }

    function setNewBase(string memory _newBase) private {
        baseURI = _newBase;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(baseURI, tokenURIs[_tokenId])); 
    }

    function getId() public view returns (uint) {
        return tokenId.current();
    }

    function mint(address _lister, string memory ipfs_hash, string memory _metadata) public {
        require(tokenCheck[ipfs_hash] != 1);
        tokenCheck[ipfs_hash] = 1;
        tokenId.increment();
        uint newID = tokenId.current();
        _safeMint(_lister, newID);
        setTokenURI(newID, _metadata);
    }

    function setTokenFractions(uint _tokenId, address _address) public {
        tokenContracts[_tokenId] = _address;
    }

    function getOwner(uint256 _tokenId) public view returns (address) {
        return ownerOf(_tokenId);
    }

    function getContract(uint _tokenId) public view returns (address) {
        return tokenContracts[_tokenId];
    }
}

