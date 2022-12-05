// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Learn is ERC20 {
    constructor() ERC20("Master Learn", "MLE") {
        _mint(msg.sender, 1000000);
    }

    enum FormationStatus {
        Pending,
        Active,
        Inactive
    }

    enum UserStatus {
        Pending,
        Active,
        Inactive
    }

    struct Formations {
        string title;
        string description;
        string[] ressources;
        string[] tags;
        FormationStatus status;
        uint8 ratingAverage;
        uint8 price;            // exprimed in MLE
        uint8 duration;         // exprimed in seconds
        uint8 creationDate;     // exprimed in seconds since 1970
        uint8 moduleCount;
        uint256 id;
        uint256 ratingCount;
    }

    struct Student {
        uint8 level;
        string userFullName;
        UserStatus status;
    }

    struct Teacher() {
        UserStatus status;
    }

    // @notice userAddress
    // @notice //first array id formation id, second is progression
    mapping(address => uint[][]) studentFormationProgression;
    mapping(address => Student) students;
    mapping(address => Teacher) teachers;
    mapping(address => uint256[]) formationOwned;
    mapping(address => uint256) userStakingBalance;
    address[] stakers;
    formation[] formations;
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

    /******* FORMATIONS *********/

    function publishFormation() {}

    function buyFormation() {}

    function redeemFromation() {}

    function evaluateFormation() {}

    function validateUserModule() {}

    function giveCertification() {}

    /******* END FORMATIONS *********/

    function buyToken() {}

    function payTeacher() {}

    function createSBT() {}

    receive() external payable {}
    fallback() external payable {}

}