// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MLE.sol";

/**
 * @title The smart contract to handle the MLE Staking
 * @author Cyril Marois & Maxence Guillemain d'Echon
**/
contract MLEStaking is Ownable {
/******************************** STRUCTS & ENUMS ********************************/

    struct StakingRecord {
        uint256 date;
        uint256 amount;
    }

    struct StakingPlan {
        uint8 planId;
        uint8 apr;
        uint128 lockPeriod;     // exprimed in seconds
        uint256 totalStakers;
        uint256 totalStakingDeposit;
        uint256 minTokenAmount; // exprimed in MLE
        uint256 maxTokenDeposit; // exprimed in MLE
        string title;
    }


/******************************** STATE VARIABLES ********************************/

    MLE mle; 

    mapping (address => StakingRecord[][2]) public userStakingDepositBalance;
    mapping (address => StakingRecord[][2]) public userStakingWithdrawalBalance;

    address[] stakers;
    StakingPlan[] public stakingPlans;


/************************************ EVENTS *************************************/

    event StakeDeposit (uint256 amount, address from, uint8 planId, uint256 totalDeposit);
    event StakeWithdrawal (uint256 amount, address from, uint8 planId, uint256 newUserStakingBalanceTotal);

/*********************************** FUNCTIONS ***********************************/
    /************ TOKEN FUNCTIONS ***************/

    constructor() Ownable() {
        _initStakingPlans();
        mle = MLE(payable(msg.sender));
    }

    function _initStakingPlans() internal {
        StakingPlan memory stakingPlanOne = StakingPlan({
            planId : 0,
            apr: 10,
            totalStakers: 0,
            totalStakingDeposit: 0,
            lockPeriod: 2 minutes,       // demo purpose, otherise 12 * 4 weeks (1 year)
            minTokenAmount: 500e18,
            maxTokenDeposit: 2500000e18,
            title: "Plan 1"
        });
        StakingPlan memory stakingPlanTwo = StakingPlan({
            planId : 1,
            apr: 20,
            totalStakers: 0,
            totalStakingDeposit: 0,
            lockPeriod: 24 * 4 weeks,        //2 years
            minTokenAmount: 500e18,
            maxTokenDeposit: 5000000e18,
            title: "Plan 2"
        });
        stakingPlans.push(stakingPlanOne);
        stakingPlans.push(stakingPlanTwo);
    }

    function stakeDeposit(address _from, uint256 _amount, uint8 _planId) external {
        require(_planId <= 1, "Error, staking plan does not exists");
        require(stakingPlans[_planId].totalStakingDeposit + _amount < stakingPlans[_planId].maxTokenDeposit, "Error, staking deposit limit reach");
        require(mle.balanceOf(_from) >= _amount, "Error, insuffisant funds to stake");
        require(mle.transferFrom(_from, address(mle), _amount), "Error, failed staking deposit");

        uint256 newUserStakingDepositBalanceTotal = _afterDepositStakingTransfer(_planId, _amount);

        emit StakeDeposit(_amount, _from, _planId, newUserStakingDepositBalanceTotal);
    }

    function stakeWithdraw(address _to, uint256 _amount, uint8 _planId) external {
        require(_planId <= 1, "Error, staking plan does not exists");

        uint256 userStakingBalanceTotal = _beforeWithdrawalStakingTransfer(_planId, _amount);

        mle.transferFrom(address(mle), _to, _amount);

        uint256 newUserStakingBalanceTotal = _afterWithdrawalStakingTransfer(_planId, _amount, userStakingBalanceTotal);

        emit StakeWithdrawal(_amount, _to, _planId, newUserStakingBalanceTotal);
    }

    function _afterDepositStakingTransfer(uint _planId, uint _amount) internal returns (uint) {
        // register deposit
        StakingRecord memory userStakingDeposit = StakingRecord({
            date: block.timestamp,
            amount: _amount
        });
        userStakingDepositBalance[msg.sender][_planId].push(userStakingDeposit);

        // update total deposit from all users
        stakingPlans[_planId].totalStakingDeposit += _amount;

        // update stakers
        _registerStakers();

        // update staking plan stakers total
        stakingPlans[_planId].totalStakers = stakers.length;

        // update user total staking deposit balance
        uint256 newUserStakingDepositBalanceTotal;
        StakingRecord[] memory deposits = userStakingDepositBalance[msg.sender][_planId];
        for (uint i = 0; i < deposits.length; i++) {
            newUserStakingDepositBalanceTotal += deposits[i].amount;
        }

        return newUserStakingDepositBalanceTotal;
    }

    function _registerStakers() internal {
        for (uint i =0; i < stakers.length; i++) {
            if (stakers[i] == msg.sender) {
                return;
            }
        }
        stakers.push(msg.sender);
    }

    function _beforeWithdrawalStakingTransfer(uint _planId, uint _amount) internal view returns (uint) {
        // count withdraw amount
        uint256 userStakingWithdrawalBalanceTotal = _getUserWithdrawalBalance(_planId);

        // count deposit amount
        uint256 userStakingDepositBalanceTotal;
        uint256 firstDepositDate;
        (userStakingDepositBalanceTotal, firstDepositDate) = _getUserStakingDepositBalance(_planId);

        uint256 userStakingBalanceTotal = userStakingDepositBalanceTotal - userStakingWithdrawalBalanceTotal;
        require(userStakingBalanceTotal  - _amount >= 0, "Error, insuffisant funds in staking to withdraw");

        // uint256 lockPeriod = stakingPlans[_planId].lockPeriod;
        // require(block.timestamp > firstDepositDate + lockPeriod, "Error, You can't withdraw before lockPeriod");

        return userStakingBalanceTotal;
    }

    function _afterWithdrawalStakingTransfer(uint _planId, uint _amount, uint _userStakingBalanceTotal) internal returns (uint) {
        // register withdraw
        StakingRecord memory tmpUserStakingWithdraw = StakingRecord({
            date: block.timestamp,
            amount: _amount
        });
        userStakingWithdrawalBalance[msg.sender][_planId].push(tmpUserStakingWithdraw);

        // update staking plan total Staking amount deposit
        stakingPlans[_planId].totalStakingDeposit -= _amount;

        // if user withdrawal all staking balance, remove it from staker
        uint256 userStakingBalanceTotal = _userStakingBalanceTotal - _amount;
        if (userStakingBalanceTotal == 0) {
            stakingPlans[_planId].totalStakers--;
            deleteStakers();
        }

        return userStakingBalanceTotal;
    }

    function _getUserStakingDepositBalance(uint _planId) internal view returns (uint, uint) {
        StakingRecord[] memory tmpUserStakingDepositBalances = userStakingDepositBalance[msg.sender][_planId];
        uint256 userStakingDepositBalanceTotal;
        uint256 firstDepositDate;
        for (uint i = 0; i < tmpUserStakingDepositBalances.length; i++) {
            if (i == 0) {
                firstDepositDate = tmpUserStakingDepositBalances[i].date;
            }
            userStakingDepositBalanceTotal += tmpUserStakingDepositBalances[i].amount;
        }

        return (userStakingDepositBalanceTotal, firstDepositDate);
    }

    function _getUserWithdrawalBalance(uint _planId) internal view returns (uint) {
        StakingRecord[] memory tmpUserStakingWithdrawalBalances = userStakingWithdrawalBalance[msg.sender][_planId];
        uint256 userStakingWithdrawalBalanceTotal;
        for (uint i = 0; i < tmpUserStakingWithdrawalBalances.length; i++) {
            userStakingWithdrawalBalanceTotal += tmpUserStakingWithdrawalBalances[i].amount;
        }

        return userStakingWithdrawalBalanceTotal;
    }

    function deleteStakers() internal {
        for (uint i = 0; i < stakers.length; i++) {
            if (stakers[i] == msg.sender) {
                delete(stakers[i]);
            }
        }
    }

}