// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Learn is ERC20 {
    constructor() ERC20("Master Learn", "MLE") {
        _mint(msg.sender, 1000000);
    }

    enum FormationStatus {
        Pending,
        Validate,
        Forbidden,
    }

    enum UserStatus {
        Pending,
        Active,
        Inactive,
    }

    struct Formations {
        uint256 id;
        string title;
        string description;
        string[] tags;
        uint1 ratingAverage;
        uint256 ratingCount;
        address teacherAddress;
        uint1 price;     // exprimed in MLE
        uint1 duration;     // exprimed in seconds
        uint creationDate;
        uint moduleCount;
        string[] links;
        string status;
    }

    struct User {
        uint256 id;
        string userFullName;
        uint256 level;
        string[] roles;

    }

    @notice userAddress
    @notice //first array id formation id, second is progression
    mapping(address => [][]uint) studentFormationProgression;
    mapping(address => User) users;
    mapping(address => uint256) userStakingBalance;
    address[] stakers;
    event stakeDepositEvent(uint256 amout, address from);

    // staking ?!
    modifier onlyUserActive() {
        require(users[msg.sender].status == UserStatus.Active);
        _;
    }

    function stakeDeposit(uint256 amount) onlyUserActive external {
        require(balanceOf(msg.sender) >= amount, "You can't stake more than you have");
        (bool success) = this.call{value: amount}('');
        require(success, "Erreur durant le staking")
        stakeAmount[msg.sender] += amount;
        // calcul reward
        emit stakeDepositEvent(msg.sender, amount);
    }

    function distributeReward() private onlyOwner {
        for(uint256 i; i < stakers.length; i++) {
            // calcul reward
            string memory staker = stakers[i];
            uint256 stakeAmount = userStakingBalance[staker];
            uint256 newStakeAmount = stakeAmount + 10 / 100;
        }
    }

    recieve() external payable {}
    fallback() external payable {}

}