// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @title The smart contract to handle the MLE token, and interractions between :
 * - the students,
 * - the teachers,
 * - the recruiters.
 * @author Cyril Marois & Maxence Guillemain d'Echon
**/
contract Staking is ERC20, Ownable {
/******************************** STRUCTS & ENUMS ********************************/
uint constant INITIAL_SUPPLY = 1000000e18;

    struct stakingDepositRecord {
        uint256 date;
        uint256 amount;
    }

    struct stakingPlan {
        uint8 planId;
        uint8 apr;
        uint128 lockPeriod;     // exprimed in seconds
        uint256 minTokenAmount; // exprimed in MLE
        uint256 maxTokenAmount; // exprimed in MLE
        string title;
    }


/******************************** STATE VARIABLES ********************************/

        // @notice we stake amount by stacking plan
    mapping (address => stakingDepositRecord[][2]) private userStakingBalance;
    // mapping (address => mapping(uint => stakingDepositRecord[])) private userStakingBalance;
    mapping (address => uint256) formationStakingBalance;
    stakingPlan[] public stakingPlans;
    // stakingDepositRecord[] stakingDepositRecords;
    uint[2] totalStakers;
    uint[2] totalStakingDeposit;

/************************************ EVENTS *************************************/



    event StakeDeposit (uint256 amount, address from, uint8 planId, uint256 totalDeposit);
    event StakeWithdrawal (uint256 amount, address from, uint8 planId, uint256 newUserStakingBalanceTotal);


/******************************* DEFAULT FUNCTIONS *******************************/

    /**
     * @notice Initializes the contract.
    **/
    constructor() ERC20("Master Learn", "MLE") Ownable() {
        _mint(msg.sender, INITIAL_SUPPLY);
        initStakingPlans();
        address teacher1 = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;
        address student1 = 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db;
        address student2 = 0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB;
        address recruiter1 = 0x617F2E2fD72FD9D5503197092aC168c91465E7f2;

        //teacher
        transfer(teacher1, 1000e18);
        // registerUser(teacher1, false, true, false);

        //student
        transfer(student1, 1000e18);
        // registerUser(student1, true, false, false);
        transfer(student2, 1000e18);
        // registerUser(student2, true, false, false);

        // recruiter
        transfer(recruiter1, 1000e18);
        // registerUser(recruiter1, false, false, true);

    }

    receive() external payable {}
    fallback() external payable {}


    /************ TOKEN FUNCTIONS ***************/

    function initStakingPlans() internal {
        stakingPlan memory stakingPlanOne = stakingPlan({
            planId : 0,
            apr: 10,
            lockPeriod: 60 * 60 * 24 * 30 * 6,
            minTokenAmount: 500,
            maxTokenAmount: 2500000,
            title: "Plan 1"
        });
        stakingPlan memory stakingPlanTwo = stakingPlan({
            planId : 1,
            apr: 20,
            lockPeriod: 60 * 60 * 24 * 30 * 12,
            minTokenAmount: 500,
            maxTokenAmount: 5000000,
            title: "Plan 2"
        });
        stakingPlans.push(stakingPlanOne);
        stakingPlans.push(stakingPlanTwo);
    }

    function stakeDeposit(uint256 _amount, uint8 _planId) external {
        require(balanceOf(msg.sender) >= _amount, "Invalid staking amount");
        require(hasStakingPlan(_planId), "Staking plan does not exists");
        require(transfer(owner(), _amount), "Failed staking deposit");

        // mapping (address => stakingDepositRecord[][2]) private userStakingBalance;
        stakingDepositRecord[] memory tmpUserStakingBalances = userStakingBalance[msg.sender][_planId];
        stakingDepositRecord memory tmpUserStakingDeposit = stakingDepositRecord({
            date: block.timestamp,
            amount: _amount
        });
        tmpUserStakingBalances[1] = tmpUserStakingDeposit;
        // first deposit in this plan
        // update user total staking deposit balance
        uint256 newUserStakingBalanceTotal;
        for (uint i = 0; i < tmpUserStakingBalances.length; i++) {
            newUserStakingBalanceTotal += tmpUserStakingBalances[i].amount;
        }
        // update stakers total
        if (totalStakers.length == 1) {
            totalStakers[_planId] += 1;
        }

        // update total deposit from all users
        if (totalStakingDeposit.length == 1) {
            totalStakingDeposit[_planId] += newUserStakingBalanceTotal;
        }

        emit StakeDeposit(_amount, msg.sender, _planId, newUserStakingBalanceTotal);
    }

    function hasStakingPlan(uint _planId) internal returns (bool) {
        bool planExist;
        for (uint i = 0; i < stakingPlans.length; i ++) {
            if (_planId == stakingPlans[i].planId) {
                planExist = true;
            }
        }
        return planExist;
    }

    function stakeWithdraw(uint256 _amount, uint8 _planId) external {
        require(hasStakingPlan(_planId), "Staking plan does not exists");
        stakingDepositRecord[] memory tmpUserStakingBalances = userStakingBalance[msg.sender][_planId];
        uint256 userStakingBalanceTotal;
        uint firstDepositDate;
        for (uint i = 0; i < tmpUserStakingBalances.length; i++) {
            if (i == 0) {
                firstDepositDate = tmpUserStakingBalances[i].date;
            }
            userStakingBalanceTotal += tmpUserStakingBalances[i].amount;
        }
        require(firstDepositDate <= block.timestamp + 24 weeks, "Forbidden, at least 6 months to withdraw after first deposit");
        require(_amount <= userStakingBalanceTotal, "Invalid withdrawal amount");
        require(transferFrom(owner(), msg.sender, _amount), "Error during stake withdrawal");
        uint newUserStakingBalanceTotal = userStakingBalanceTotal - _amount;

        emit StakeWithdrawal(_amount, msg.sender, _planId, newUserStakingBalanceTotal);
    }


}