pragma solidity ^0.8.12;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./models/Game.sol";

contract Treasury is Ownable, ReentrancyGuard {
    uint public GAME_FEE = 3.5 ether;
    uint public TOTAL_PERCENTAGE = 100 ether;
    uint public MAX_WAGER = 250 ether;
    uint public NFT_FEE = 65 ether;
    uint public VAULT_FEE = 30 ether;
    uint public DEFAULT_BALANCE;

    address public TREASURY_OWNER;
    address public TEAM_VAULT;

    uint public TeamVaultBalance;
    uint public NFTVaultBalance;

    uint public GameIndexer;

    mapping(uint => Game) public Games;

    event Received(address sender, uint value);
    event DistributedFeeBackToVaults(uint teamVaultAmount, uint nftVaultAmount);
    event WithdrawnTeamVault(uint value);
    event TreasuryBalanceSetToDefault(uint defaultBalance);
    event GameWagerSet(uint gameId, uint wager, address player);
    event GameStateSet(uint gameId, GameState state, address player);
    event GameEnded(uint gameId, GameResult gameResult, address player);
    event FeeDistributed(address receiver, uint value);

    constructor(
        address _treasuryOwner,
        address _teamVault,
        uint _defaultBalance)
    {
        TREASURY_OWNER = _treasuryOwner;
        TEAM_VAULT = _teamVault;

        DEFAULT_BALANCE = _defaultBalance;
    }

    /**
     * @dev Modifier to give TREASURY_OWNER access to specific functions
    */
    modifier TreasuryOwner() {
        require(TREASURY_OWNER == _msgSender(), "Error: Sender is not the treasury owner");
        _;
    }

    /**
     * @dev Receive funds when Treasury is running low
     */
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }


    /**
     * @dev Function for checking if a game exists and return Game
     * @param _gameId the id of the game
     * @return Game
    */
    function GetGame(uint _gameId) nonReentrant external returns(Game memory) {
        _validGame(_gameId);
        return Games[_gameId];
    }

    /**
     * @dev Function to start a game and set wager
     * @param _gameAction action that player plays: 0 ROCK, 1 PAPER, 2 SCISSOR
     * @return gameId
    */
    function SetWager(uint _gameAction) nonReentrant external payable returns(uint gameId) {
        require(msg.value > 0, "Error: Can't set 0 as wager");
        require(msg.value <= MAX_WAGER, "Error: Wager can't be more than MAX_WAGER");
        require(address(this).balance >= (msg.value * 2), "Error: Not enough funds in contract for eventual payout");
        require(_gameAction <= 2, "Error: Invalid game action");

        GameIndexer += 1;
        gameId = GameIndexer;
        Games[gameId].Id = gameId;
        Games[gameId].PlayerAddress = _msgSender();
        Games[gameId].Wager = msg.value;
        Games[gameId].Result = GameResult.UNKNOWN;
        Games[gameId].Action = GameAction(_gameAction);
        Games[gameId].State = GameState.WAGER_SET;
        Games[gameId].Exists = true;

        emit GameWagerSet(gameId, Games[gameId].Wager, Games[gameId].PlayerAddress);
        emit GameStateSet(gameId, Games[gameId].State, Games[gameId].PlayerAddress);
        return gameId;
    }

    /**
     * @dev Function to withdraw wager from unplayed game
     * @param _gameId the id of the game
     * @return gameId
    */
    function WithdrawWager(uint _gameId) nonReentrant external returns(uint) {
        _validGame(_gameId);
        _requireState(_gameId, GameState.WAGER_SET);
        require(Games[_gameId].PlayerAddress == _msgSender(), "Error: Only player can withdraw wager");
        uint wager = Games[_gameId].Wager;
        Games[_gameId].Wager = 0;
        Games[_gameId].State = GameState.CANCELED;
        (bool success, ) = Games[_gameId].PlayerAddress.call{value:wager}('Transfer back wager');
        require(success, "Error: Returning back wager to player failed");
        emit GameStateSet(_gameId, Games[_gameId].State, Games[_gameId].PlayerAddress);
        emit GameEnded(_gameId, Games[_gameId].Result, Games[_gameId].PlayerAddress);
        return _gameId;
    }

    /**
     * @dev TreasuryOwner function for updating the game
     * @param _gameId the id of the game
     * @param _result the result of the game
     * @return gameId
    */
    function UpdateGame(uint _gameId, uint _result) TreasuryOwner() nonReentrant external returns(uint) {
        _validGame(_gameId);
        _requireState(_gameId, GameState.WAGER_SET);

        // Congratulations
        if (_result == 0) {
            uint returnWager = Games[_gameId].Wager * 2;

            uint fromTreasury = _takeGameFee(returnWager, true, false);
            require(address(this).balance >= fromTreasury, "Error: Not enough funds in contract for payout");

            Games[_gameId].Result = GameResult.WIN;
            (bool success, ) = Games[_gameId].PlayerAddress.call{value:fromTreasury}('Transfer back double wager');
            require(success, "Error: Returning back wager to player failed");
        } else if (_result == 1) {
            Games[_gameId].Result = GameResult.LOSE;
            _takeGameFee(Games[_gameId].Wager, false, false);
        } else if (_result == 2) {
            Games[_gameId].Result = GameResult.TIE;
            (bool success, ) = Games[_gameId].PlayerAddress.call{value:Games[_gameId].Wager}('Transfer back wager');
            require(success, "Error: Returning back wager to player failed");
        }

        Games[_gameId].State = GameState.RESULT_SET;
        emit GameStateSet(_gameId, Games[_gameId].State, Games[_gameId].PlayerAddress);
        emit GameEnded(_gameId, Games[_gameId].Result, Games[_gameId].PlayerAddress);
        return _gameId;
    }

    /**
    * @dev Treasury Function to distribute the fees to NFT Holders
    */
    function SendNFTFeeToAddress(address _receiver, uint _amount) nonReentrant TreasuryOwner() external {
        require(NFTVaultBalance > 0, "Error: NFTVaultBalance is 0");
        require(NFTVaultBalance >= _amount, "Error: NFTVaultBalance is less than _amount");
        NFTVaultBalance -= _amount;
        (bool success, ) = _receiver.call{value:_amount}('Transfer fee to NFT holder');
        require(success, "Error: Transfer to NFT holder failed");
        emit FeeDistributed(_receiver, _amount);
    }

    /**
    * @dev Owner function for setting MAX_WAGER value
     * @param _newWager the new MAX_WAGER value
    */
    function SetMaxWager(uint _newWager) onlyOwner() external returns(uint) {
        MAX_WAGER = _newWager;
        return MAX_WAGER;
    }

    /**
     * @dev Owner function for setting TREASURY OWNER
     * @param _newOwner new address of treasury
    */
    function SetTreasuryOwner(address _newOwner) onlyOwner() external returns(address) {
        TREASURY_OWNER = _newOwner;
        return TREASURY_OWNER;
    }

    /**
     * @dev Owner function for setting TEAM_VAULT
     * @param _newVault new address of TEAM_VAULT
    */
    function SetTeamVault(address _newVault) onlyOwner() external returns(address) {
        TEAM_VAULT = _newVault;
        return TEAM_VAULT;
    }

    /**
     * @dev Owner function for setting DEFAULT_BALANCE
     * @param _newBalance set DEFAULT_BALANCE
    */
    function SetDefaultBalance(uint _newBalance) onlyOwner() external {
        require(_newBalance > DEFAULT_BALANCE, "Error: Default balance must be greater than current balance");
        DEFAULT_BALANCE = _newBalance;
    }

    /**
     * @dev Owner function for transferring the TeamVaultBalance to the TEAM_VAULT Address
    */
    function WithdrawTeamVault() nonReentrant onlyOwner() external {
        require(TeamVaultBalance > 0, "Error: TeamVaultBalance is 0");
        uint teamVault = TeamVaultBalance;
        TeamVaultBalance = 0;
        (bool success, ) = TEAM_VAULT.call{value:teamVault}('Transfer TeamVaultBalance balance to TEAM_VAULT');
        require(success, "Error: Transfer to TEAM_VAULT failed");
        emit WithdrawnTeamVault(teamVault);
    }

    /**
     * @dev Owner function for resetting Treasury balance to DEFAULT_BALANCE
    */
    function SetTreasuryBalanceToDefault() nonReentrant onlyOwner() external {
        require(address(this).balance > 0, "Error: Treasury is 0");
        require(address(this).balance > DEFAULT_BALANCE, "Error: Treasury balance is less than default balance");
        uint treasuryBalance = address(this).balance - DEFAULT_BALANCE;
        (bool success, ) = TEAM_VAULT.call{value:treasuryBalance}('Transfer treasuryBalance to TEAM_VAULT');
        require(success, "Error: Transfer to TEAM_VAULT failed");
        emit TreasuryBalanceSetToDefault(treasuryBalance);
    }

    function _takeGameFee(uint _wager, bool _winFee, bool _insideDistribution) private returns(uint) {
        uint fee = 0;

        if (!_insideDistribution) {
            fee = _wager * GAME_FEE / TOTAL_PERCENTAGE;
        } else {
            fee = _wager;
        }

        uint teamVault = fee * VAULT_FEE / TOTAL_PERCENTAGE;
        uint nftVault = fee * NFT_FEE / TOTAL_PERCENTAGE;
        TeamVaultBalance += teamVault;
        NFTVaultBalance += nftVault;
        uint fromTreasury =  _wager - fee;
        return fromTreasury;
    }

    /**
     * @dev Private function to check if game exists
     * @param _gameId the id of the game
    */
    function _validGame(uint _gameId) private {
        require(Games[_gameId].Exists, "Error: Game doesn't exist");
    }

    /**
     * @dev Private function to check if game has the right state for execution
     * @param _gameId the id of the game
     * @param _state the required state of the game
    */
    function _requireState(uint _gameId, GameState _state) private {
        require(Games[_gameId].State == _state, "Error: Game state don't match");
    }
}
