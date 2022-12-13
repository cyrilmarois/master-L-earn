// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
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
        uint256 lockPeriod;     // exprimed in seconds
        uint256 totalStakedValue;
        uint256 minTokenAmount; // exprimed in MLE
        uint256 maxTokenDeposit; // exprimed in MLE
        string title;
        address[] stakers;
    }

    struct Stake {
        StakingRecord[][2] deposits;
        StakingRecord[][2] withdrawals;
        uint[2] totalStakedValue;
        uint[2] profits;
    }


/******************************** STATE VARIABLES ********************************/

    MLE mle;

    mapping (address => Stake) userStakes;

    StakingPlan[] public stakingPlans;
    uint256 lastProfitDistribution;
    uint distributionPeriod = 1 seconds; 



/************************************ EVENTS *************************************/

    event StakeDeposit (uint256 amount, address from, uint8 planId);
    event StakeWithdrawal (uint256 amount, address from, uint8 planId);

/*********************************** FUNCTIONS ***********************************/
/**************** GETTERS *******************/

function getUsertotalStakedValue(address _addr, uint8 _planId) external view returns(uint) {
    return userStakes[_addr].totalStakedValue[_planId];
}

/************ TOKEN FUNCTIONS ***************/

    constructor() Ownable() {
        _initStakingPlans();
        mle = MLE(payable(msg.sender));
        lastProfitDistribution = block.timestamp;
    }

    function _initStakingPlans() internal {
        address[] memory s0;
        address[] memory s1;
        StakingPlan memory stakingPlanOne = StakingPlan({
            planId : 0,
            totalStakedValue: 0,
            lockPeriod: 0,       // demo purpose, otherise 12 * 4 weeks (1 year)
            minTokenAmount: 500e18,
            maxTokenDeposit: 2500000e18,
            title: "Plan 1",
            stakers: s0
        });
        StakingPlan memory stakingPlanTwo = StakingPlan({
            planId : 1,
            totalStakedValue: 0,
            lockPeriod: 10, // demo purpose, otherise 24 * 4 weeks (2 years)
            minTokenAmount: 500e18,
            maxTokenDeposit: 5000000e18,
            title: "Plan 2",
            stakers: s1
        });
        stakingPlans.push(stakingPlanOne);
        stakingPlans.push(stakingPlanTwo);
    }

    function stakeDeposit(address _from, uint256 _amount, uint8 _planId) onlyOwner external {
        require(_planId <= 1, "Staking plan does not exists");
        require(stakingPlans[_planId].totalStakedValue + _amount < stakingPlans[_planId].maxTokenDeposit, "Staking deposit limit reached");
        require(mle.balanceOf(_from) >= _amount, "Insufficient balance");
        require(mle.transferFrom(_from, address(mle), _amount), "Failed staking deposit");

        _afterDepositTransfer(_from, _planId, _amount);

        emit StakeDeposit(_amount, _from, _planId);
    }

    function stakeWithdraw(address _to, uint256 _amount, uint8 _planId) 
        onlyOwner external {
        require(_planId <= 1, "Staking plan does not exists");

        _beforeWithdrawalTransfer(_to, _planId, _amount);

        require(mle.transferFrom(address(mle), _to, _amount), "Failed staking withdrawal");

        _afterWithdrawalTransfer(_to, _planId, _amount);

        emit StakeWithdrawal(_amount, _to, _planId);
    }

    function _afterDepositTransfer(address _from, uint _planId, uint _amount) internal {
        // register deposit
        StakingRecord memory userStakingDeposit = StakingRecord({
            date: block.timestamp,
            amount: _amount
        });
        userStakes[_from].deposits[_planId].push(userStakingDeposit);
        
        userStakes[_from].totalStakedValue[_planId] += _amount;

        // update total deposit from all users
        stakingPlans[_planId].totalStakedValue += _amount;

        // update stakers
        _registerStakers(_from, _planId);
    }

    function _beforeWithdrawalTransfer(address _to, uint _planId, uint _amount) 
        internal view {

        require(userStakes[_to].totalStakedValue[_planId] >= _amount, "Insufficient balance to withdraw");

        uint firstDepositDate = userStakes[_to].deposits[_planId][0].date;

        uint lockPeriod = stakingPlans[_planId].lockPeriod;
        // string memory str1 = Strings.toString(lockPeriod);
        // string memory str2 = Strings.toString(block.timestamp);
        // string memory str3 = Strings.toString(firstDepositDate);
        // require (block.timestamp >= firstDepositDate + lockPeriod, 
        //     string(bytes.concat( bytes(str1), bytes(" "),  bytes(str2), bytes(" "), bytes(str3)  ))
        //     );
        require (block.timestamp >= firstDepositDate + lockPeriod, "You can't withdraw before lockPeriod");
    }

    function _afterWithdrawalTransfer(address _to, uint _planId, uint _amount) internal {
        // register withdraw
        StakingRecord memory tmpUserStakingWithdraw = StakingRecord({
            date: block.timestamp,
            amount: _amount
        });
        userStakes[_to].withdrawals[_planId].push(tmpUserStakingWithdraw);
        userStakes[_to].totalStakedValue[_planId] -= _amount;

        // update staking plan total Staking amount deposit
        stakingPlans[_planId].totalStakedValue -= _amount;
        
        // if user withdrawal all staking balance, remove it from staker
        if (userStakes[_to].totalStakedValue[_planId] == 0) {
            _deleteStakers(_to, _planId);
        }
    }

    function distributeProfits(uint256 _profitToDistribute) external onlyOwner {
        // compute the number of periods elapsed since the last distribution
        //require (block.timestamp - lastProfitDistribution > distributionPeriod, "");

        uint profitShare;
        address staker;
        for (uint8 _planId; _planId<2; _planId++) {
            for (uint i; i < stakingPlans[_planId].stakers.length; i++) {
                staker = stakingPlans[_planId].stakers[i];
                profitShare = _profitToDistribute 
                        * userStakes[staker].totalStakedValue[_planId] / stakingPlans[_planId].totalStakedValue;
                require(mle.transferFrom(address(mle), staker, profitShare), "Failed staking withdrawal");
            }
        }
        lastProfitDistribution = block.timestamp;
    }

    function _registerStakers(address _addr, uint _planId) internal {
        for (uint i; i < stakingPlans[_planId].stakers.length; i++) {
            if (stakingPlans[_planId].stakers[i] == _addr) {
                return;
            }
        }
        stakingPlans[_planId].stakers.push(_addr);
    }

    function _deleteStakers(address _addr, uint _planId) internal {
        for (uint i; i < stakingPlans[_planId].stakers.length; i++) {
            if (stakingPlans[_planId].stakers[i] == _addr) {
                delete(stakingPlans[_planId].stakers[i]);
            }
        }
    }

}