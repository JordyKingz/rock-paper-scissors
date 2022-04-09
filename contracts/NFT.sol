pragma solidity ^0.8.12;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFT is ERC721Enumerable, Ownable, ReentrancyGuard{
    uint256 public mintPrice = 0.1 ether;
    uint256 public constant maxSupply = 550;
    uint256 public constant mintLimit = 3;

    mapping(address => uint256) public TotalMinted;
    string public BaseURI;
    bool public MintingOpen;

    constructor (string memory baseUri) public ERC721("NFT", "NFT"){
        BaseURI = baseUri;
        MintingOpen = true;
    }

    function _baseURI() internal view override returns (string memory) {
        return BaseURI;
    }

    function Mint(uint nr) nonReentrant external payable{
        require(MintingOpen, "Minting has not yet started");
        require(nr <= mintLimit, "Cannot mint more than allowed");
        require(msg.value >= mintPrice * nr, "Not enough matic send");
        _mint(nr);
    }

    function _mint(uint nr) private{
        require(totalSupply() < maxSupply, "All tokens have been minted");
        require((totalSupply() + nr) <= maxSupply, "You cannot exceed max supply");
        for(uint256 i = 0; i < nr; i++)
        {
            TotalMinted[_msgSender()] += 1;
            _safeMint(_msgSender(), totalSupply() + 1);
        }
    }

    function TransferMatic() onlyOwner external{
        require(address(this).balance > 0, "No matic present");
        (bool ownerTransfer, ) = owner().call{value: address(this).balance}('');
        require(ownerTransfer, "Transfer to owner address failed.");
    }

    function SetBaseUri(string memory baseUri) onlyOwner external{
        BaseURI = baseUri;
    }

    function setPrice(uint256 _newPrice) onlyOwner external{
        mintPrice = _newPrice;
    }

    function ToggleMinting() onlyOwner external{
        MintingOpen = !MintingOpen;
    }
}