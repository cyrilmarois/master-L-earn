// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @title The smart contract to handle the MLE token, and interractions between :
 * - the students,
 * - the teachers,
 * - the recruiters.
 * @author Cyril Marois & Maxence Guillemain d'Echon
**/
contract MLE is ERC20, ERC20Votes, Ownable {
/******************************** STRUCTS & ENUMS ********************************/

    struct TeacherFormation {
        uint8 modulesCount;
        uint32 ratingsSum;
        uint32 ratingsCount;
        uint32 duration;         // exprimed in seconds
        uint128 creationDate;    // exprimed in seconds since 1970
        uint price;              // exprimed in MLE
        string title;
        string[] tags;
        address[] students;
    }

    struct StudentFormation {
        address teacherAddress;
        uint16 formationId;
        uint8 validatedModulesNumber;
        bool isCertified;
        bool isRated;
        uint cashback;
    }

    struct Announce {
        bool isActive;
        uint creationDate;     // exprimed in seconds since 1970
        string title;
        string[] tags;
        address[] candidates;
        // TBD : add specific conditions to be able to apply ?
    }

    struct Job {
        bool isAccepted;
        address recruiterAddress;
        uint16 announceId;
        uint128 entryDate;     // exprimed in seconds since 1970
        string title;
        string description;
        uint challenge;
    }

    struct Student {
        bool isRegistered;
        StudentFormation[] formations;
        Job[] jobs;
    }

    struct Teacher {
        bool isRegistered;
        TeacherFormation[] formations;
    }

    struct Recruiter {
        bool isRegistered;
        Announce[] announces;
    }

    struct stakingDepositRecord {
        uint256 date;
        uint256 amount;
    }

    struct stakingPlan {
        uint8 planId;
        uint8 apr;
        uint128 lockPeriod;     // exprimed in seconds
        uint128 totalStakers;
        uint256 totalStakingDeposit;
        uint256 minTokenAmount; // exprimed in MLE
        uint256 maxTokenAmount; // exprimed in MLE
        string title;
    }


/******************************** STATE VARIABLES ********************************/

    mapping (address => Student) students;
    mapping (address => Teacher) teachers;
    mapping (address => Recruiter) recruiters;

    mapping (address => stakingRecord[][2]) public userStakingDepositBalance;
    mapping (address => stakingRecord[][2]) public userStakingWithdrawalBalance;
    mapping (address => uint256) formationStakingBalance;

    address[] stakers;
    stakingPlan[] stakingPlans;
    uint announcePostPrice = 50e18;
    uint formationFee = 3; // %
    uint formationFeeBurn = 0; // %
    uint teacherReward = 1000e18;
    uint jobSignedReward = 1000e18;
    uint32 minRatingCountForTeacherReward = 5;
    uint32 minRatingForTeacherReward = 35;

    uint constant INITIAL_SUPPLY = 1000000e18;
    uint constant RECRUITMENT_COMMISSION = 10; // %
    uint constant MAX_GRADE = 50;

/************************************ EVENTS *************************************/

    event StudentRegistered (address studentAddress);
    event TeacherRegistered (address teacherAddress);
    event RecruiterRegistered (address recruiterAddress);

    event FormationPublished (address teacherAddress, uint teacherFormationId);
    event FormationCertified (address teacherAddress, uint teacherFormationId, address studentAddress);
    event AnnouncePublished (address recruiterAddress, uint announceId);

    event TeacherRewarded(address teacherAddress);
    event RecruitmentReward(address _studentAddress, uint16 _jobId);

    event StakeDeposit (uint256 amount, address from, uint8 planId, uint256 totalDeposit);
    event StakeWithdrawal (uint256 amount, address from, uint8 planId, uint256 newUserStakingBalanceTotal);


/******************************* DEFAULT FUNCTIONS *******************************/

    /**
     * @notice Initializes the contract.
    **/
    constructor() ERC20("Master L&Earn", "MLE") Ownable() ERC20Permit("Master L&Earn") {
        _mint(msg.sender, INITIAL_SUPPLY);

        _initStakingPlans();

        address teacher1 = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;
        address student1 = 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db;
        address student2 = 0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB;
        address recruiter1 = 0x617F2E2fD72FD9D5503197092aC168c91465E7f2;

        //teacher
        transfer(teacher1, 1000e18);
        registerUser(teacher1, false, true, false);

        //student
        transfer(student1, 1000e18);
        registerUser(student1, true, false, false);
        transfer(student2, 1000e18);
        registerUser(student2, true, false, false);

        // recruiter
        transfer(recruiter1, 1000e18);
        registerUser(recruiter1, false, false, true);

    }

    receive() external payable {}
    fallback() external payable {}

/*********************************** MODIFIERS ***********************************/
/*********************************** FUNCTIONS ***********************************/
    /***************** UTILS ********************/
    function _removeAddressFromTab(address[] memory _tab, address _address)
    internal pure returns(address[] memory) {
        for (uint _i; _i < _tab.length; _i++) {
            if (_tab[_i] == _address) {
                _tab[_i] = _tab[_tab.length - 1];
                delete (_tab[_tab.length - 1]);
            }
        }
        return _tab;
    }

    function _afterTokenTransfer(address from, address to, uint amount) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address account, uint amount) internal override(ERC20, ERC20Votes) {
        super._mint(account, amount);
    }

    function _burn(address account, uint amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }

    /************* GETTERS & SETTERS ************/

    function getAnnounceForRecruiter (address _recruiterAddress, uint16 _announceId)
    external view returns(Announce memory) {
        require (recruiters[_recruiterAddress].isRegistered, "Recruiter address not registered");
        require (_announceId < recruiters[_recruiterAddress].announces.length, "Announce not found");
        return recruiters[_recruiterAddress].announces[_announceId];
    }

    function getAnnouncesForRecruiter (address _recruiterAddress)
    external view returns(Announce[] memory) {
        require (recruiters[_recruiterAddress].isRegistered, "Recruiter address not registered");
        return recruiters[_recruiterAddress].announces;
    }

    function getFormationForTeacher (address _teacherAddress, uint16 _formationId)
    external view returns(TeacherFormation memory) {
        require (teachers[_teacherAddress].isRegistered, "Teacher address not registered");
        require (_formationId < teachers[_teacherAddress].formations.length, "Formation not found");
        return teachers[_teacherAddress].formations[_formationId];
    }

    function getTeacherFormationsForTeacher (address _teacherAddress)
    external view returns(TeacherFormation[] memory) {
        require (teachers[_teacherAddress].isRegistered, "Teacher address not registered");
        return teachers[_teacherAddress].formations;
    }

    function getFormationsForStudent (address _studentAddress)
    external view returns(StudentFormation[] memory) {
        require (students[_studentAddress].isRegistered, "Student address not registered");
        return students[_studentAddress].formations;
    }

    function getJobsForStudent (address _studentAddress)
    external view returns(Job[] memory) {
        require (students[_studentAddress].isRegistered, "Student address not registered");
        return students[_studentAddress].jobs;
    }

    function setAnnouncePostPrice (uint _announcePostPrice) external onlyOwner {
        announcePostPrice = _announcePostPrice;
    }

    function setFormationFee (uint _formationFee) external onlyOwner {
        require (_formationFee < 100, "formationFee is in percent (<100)");
        formationFee = _formationFee;
    }

    function setFormationFeeBurn (uint _formationFeeBurn) external onlyOwner {
        require (_formationFeeBurn < 100, "formationFeeBurn is in percent (<100)");
        formationFeeBurn = _formationFeeBurn;
    }

    function setQualityFormationReward (uint _teacherReward) external onlyOwner {
        teacherReward = _teacherReward;
    }

    function setJobSignedReward (uint _jobSignedReward) external onlyOwner {
        jobSignedReward = _jobSignedReward;
    }

    function registerUser(address _address, bool _asStudent, bool _asTeacher, bool _asRecruiter) public {
        if (_asStudent)
            students[_address].isRegistered = true;
        if (_asTeacher)
            teachers[_address].isRegistered = true;
        if (_asRecruiter)
            recruiters[_address].isRegistered = true;
    }

    /********** FORMATIONS FUNCTIONS ************/

    function postFormation (
        uint8 _modulesCount,
        uint16 _duration,
        uint _price,
        string memory _title,
        string[] memory _tags
    ) external {
        address[] memory stds;
        teachers[msg.sender].formations.push( TeacherFormation (
            _modulesCount,
            0,
            0,
            _duration,
            uint128(block.timestamp),
            _price,
            _title,
            _tags,
            stds
        ));
    }

    function validateUserModule (address _studentAddress, uint16 _teacherFormationId) external {
        require (students[_studentAddress].isRegistered, "Student address not registered");

        uint16 _id = _retrieveStudentFormationId(_studentAddress, msg.sender, _teacherFormationId);
        StudentFormation memory _studentFormation = students[_studentAddress].formations[_id];
        require (!_studentFormation.isCertified, "Formation already certified");
        require (_studentFormation.validatedModulesNumber < teachers[msg.sender].formations[_teacherFormationId].modulesCount, "");

        students[_studentAddress].formations[_id].validatedModulesNumber++;

        // Cashback
        if (formationStakingBalance[_studentAddress] > _studentFormation.cashback) {
            formationStakingBalance[_studentAddress] -= _studentFormation.cashback;
            _transfer(owner(), _studentAddress, _studentFormation.cashback);
        }
    }

    function certifyUserFormation (address _studentAddress, uint16 _teacherFormationId) external {
        require (students[_studentAddress].isRegistered, "Student address not registered");

        uint16 _id = _retrieveStudentFormationId(_studentAddress, msg.sender, _teacherFormationId);
        require (!students[_studentAddress].formations[_id].isCertified, "Formation already certified");

        teachers[msg.sender].formations[_teacherFormationId].students
         = _removeAddressFromTab(teachers[msg.sender].formations[_teacherFormationId].students,
         _studentAddress);

        students[_studentAddress].formations[_id].isCertified = true;
    }

    function _retrieveStudentFormationId (address _studentAddress, address _teacherAddress, uint16 _teacherFormationId)
        internal view returns(uint16) {
        // Retrieve within the formations owned by the sender and followed by the student the formation which:
        // - has the teacherAddress msg.sender
        // - has the id _teacherFormationId
        bool _found;
        uint16 _id;
        for (; _id < students[_studentAddress].formations.length; _id++) {
            if (students[_studentAddress].formations[_id].teacherAddress == _teacherAddress
                && students[_studentAddress].formations[_id].formationId == _teacherFormationId) {
                _found = true;
                break;
            }
        }
        require (_found, "formation not found");
        return _id;
    }

    function buyFormation (address _teacherAddress, uint16 _teacherFormationId) external {
        require (teachers[_teacherAddress].isRegistered, "Student address not registered");
        require (_teacherFormationId < teachers[_teacherAddress].formations.length, "Formation not found");

        TeacherFormation memory _teacherFormation = teachers[_teacherAddress].formations[_teacherFormationId];

        // Pay formation
        require (balanceOf(msg.sender) >= 2 * _teacherFormation.price, "Insufficient balance");
        uint _fee = _teacherFormation.price * formationFee / 100;
        uint _feeBurn = formationFee * formationFeeBurn / 100;
        uint _teacherCut = _teacherFormation.price - _fee;
        require (transfer(_teacherAddress, _teacherCut));
        require (transfer(owner(), _teacherFormation.price + _fee - _feeBurn));
        _burn(_teacherAddress, _feeBurn);
        formationStakingBalance[msg.sender] += _teacherFormation.price;

        // Add new StudentFormation to student
        uint cashback = _teacherFormation.price / _teacherFormation.modulesCount ;
        StudentFormation memory _studentFormation =
            StudentFormation (_teacherAddress, _teacherFormationId, 0, false, false, cashback);
        students[msg.sender].formations.push(_studentFormation);

        // Add student address to formation
        teachers[_teacherAddress].formations[_teacherFormationId].students.push(msg.sender);
    }

    function evaluateFormation (address _teacherAddress, uint16 _teacherFormationId, uint8 grade) external {
        require (grade <= MAX_GRADE, "Grade too high");
        require (teachers[_teacherAddress].isRegistered, "Teacher address not registered");
        require (_teacherFormationId < teachers[_teacherAddress].formations.length, "Formation not found");
        uint16 _id = _retrieveStudentFormationId(msg.sender, _teacherAddress, _teacherFormationId);
        // TBD conditions de droit de notation :
        require (students[msg.sender].formations[_id].isCertified, "Student cannot evaluate yet");
        require (!students[msg.sender].formations[_id].isRated, "Student already evaluated this formation");

        students[msg.sender].formations[_id].isRated = true;
        teachers[_teacherAddress].formations[_teacherFormationId].ratingsSum += grade;
        teachers[_teacherAddress].formations[_teacherFormationId].ratingsCount ++;

        _rewardTeacher(_teacherAddress, _teacherFormationId);
    }

    function _rewardTeacher (address _teacherAddress, uint16 _teacherFormationId) internal {
        // TDB condition reward

        uint32 ratingsSum = teachers[_teacherAddress].formations[_teacherFormationId].ratingsSum;
        uint32 ratingsCount = teachers[_teacherAddress].formations[_teacherFormationId].ratingsCount;

        if (ratingsCount > minRatingCountForTeacherReward &&
            ratingsSum > ratingsCount * minRatingForTeacherReward) {
            _mint(_teacherAddress, teacherReward);
            emit TeacherRewarded(_teacherAddress);
        }
    }

    /******* ANNOUNCES & JOBS FUNCTIONS *********/

    function postAnnounce(
        string memory _title,
        string[] memory _tags
    ) external {
        require (transfer(owner(), announcePostPrice), "Not enough tokens");
        address[] memory candidates;
        recruiters[msg.sender].announces.push( Announce (
            true,
            block.timestamp,
            _title,
            _tags,
            candidates
        ));
    }

    function offerJob(
        address _studentAddress,
        uint16 _announceId,
        string memory _title,
        string memory _description
    ) external {
        require (students[_studentAddress].isRegistered, "Student address not registered");
        students[_studentAddress].jobs.push( Job (
            false,
            msg.sender,
            _announceId,
            0,
            _title,
            _description,
            0
        ));
    }

    function applyAnnounce(address _recruiterAddress, uint16 _announceId) external {
        require (recruiters[_recruiterAddress].isRegistered, "Recruiter address not registered");
        require (_announceId < recruiters[_recruiterAddress].announces.length, "Announce not found");

        bool _found;
        // TBD : limit size of candidates tab ?
        for (uint _id; _id < recruiters[_recruiterAddress].announces[_announceId].candidates.length; _id++) {
            if (recruiters[_recruiterAddress].announces[_announceId].candidates[_id] == msg.sender)
                _found = true;
        }
        require (!_found, "Announce already applied");

        recruiters[_recruiterAddress].announces[_announceId].candidates.push(msg.sender);
    }

    function answerJobOffer(bool _doAccept, uint16 _jobId) external {
        require (_jobId < students[msg.sender].jobs.length, "Job not found");

        students[msg.sender].jobs[_jobId].isAccepted = _doAccept;
    }

    function proveId(uint16 _jobId, uint _challenge) external {
        students[msg.sender].jobs[_jobId].challenge = _challenge;
    }

    function verifyId(address _studentAddress, uint16 _jobId, uint _challenge) external {
        // verify ID by checking challenge
        require (students[_studentAddress].jobs[_jobId].challenge == _challenge, "Id not verified");

        // Remove Job Announce
        uint16 _id = students[_studentAddress].jobs[_jobId].announceId;
        recruiters[msg.sender].announces[_id].isActive = false;

        // Reward the DAO by minting 1000 MLE
        _mint(owner(), jobSignedReward);
        emit RecruitmentReward(_studentAddress, _jobId);
    }

    /************ TOKEN FUNCTIONS ***************/

    function _initStakingPlans() internal {
        stakingPlan memory stakingPlanOne = stakingPlan({
            planId : 0,
            apr: 10,
            totalStakers: 0,
            totalStakingDeposit: 0,
            lockPeriod: 12 * 4 weeks,
            minTokenAmount: 500,
            maxTokenAmount: 2500000,
            title: "Plan 1"
        });
        stakingPlan memory stakingPlanTwo = stakingPlan({
            planId : 1,
            apr: 20,
            totalStakers: 0,
            totalStakingDeposit: 0,
            lockPeriod: 24 * 4 weeks,
            minTokenAmount: 500,
            maxTokenAmount: 5000000,
            title: "Plan 2"
        });
        stakingPlans.push(stakingPlanOne);
        stakingPlans.push(stakingPlanTwo);
    }

    function stakeDeposit(uint256 _amount, uint8 _planId) external {
        require(_planId <= 1, "Error, staking plan does not exists");
        require(balanceOf(msg.sender) >= _amount, "Error, insuffisant funds to stake");
        require(transfer(owner(), _amount), "Error, failed staking deposit");

        uint256 newUserStakingDepositBalanceTotal = _afterDepositStakingTransfer(_planId, _amount);

        emit StakeDeposit(_amount, msg.sender, _planId, newUserStakingDepositBalanceTotal);
    }

    function _afterDepositStakingTransfer(uint _planId, uint _amount) internal returns (uint) {
        // register transfer
        stakingRecord memory userStakingDeposit = stakingRecord({
            date: block.timestamp,
            amount: _amount
        });
        userStakingDepositBalance[msg.sender][_planId].push(userStakingDeposit);
        stakingRecord[] memory deposits = userStakingDepositBalance[msg.sender][_planId];

        // update staking plan stakers total
        if (deposits.length == 1) {
            stakingPlans[_planId].totalStakers += 1;
        }

        // update total deposit from all users
        stakingPlans[_planId].totalStakingDeposit += _amount;

        // update stakers
        registerStakers();

        // update user total staking deposit balance
        uint256 newUserStakingDepositBalanceTotal;
        for (uint i = 0; i < deposits.length; i++) {
            newUserStakingDepositBalanceTotal += deposits[i].amount;
        }

        return newUserStakingDepositBalanceTotal;
    }

    function registerStakers() internal {
        for (uint i =0; i < stakers.length; i++) {
            if (stakers[i] == msg.sender) {
                return;
            }
        }
        stakers.push(msg.sender);
    }

    function stakeWithdraw(uint256 _amount, uint8 _planId) external {
        require(_planId <= 1, "Error, staking plan does not exists");

        uint256 userStakingBalanceTotal = _beforeWithdrawalStakingTransfer(_planId, _amount);

        _transfer(owner(), msg.sender, _amount);

        uint256 newUserStakingBalanceTotal = _afterWithdrawalStakingTransfer(_planId, _amount, userStakingBalanceTotal);

        emit StakeWithdrawal(_amount, msg.sender, _planId, newUserStakingBalanceTotal);
    }

    function _beforeWithdrawalStakingTransfer(uint _planId, uint _amount) internal view returns (uint) {
        // count withdraw amount
        uint256 userStakingWithdrawalBalanceTotal = _getUserWithdrawalBalance(_planId);

        // count deposit amount
        uint256 userStakingDepositBalanceTotal;
        uint256 firstDepositDate;
        (userStakingDepositBalanceTotal, firstDepositDate) = _getUserStakingDepositBalance(_planId);

        uint256 userStakingBalanceTotal = userStakingDepositBalanceTotal - userStakingWithdrawalBalanceTotal;
        require(userStakingBalanceTotal  - _amount <= 0, "Error, insuffisant funds in staking to withdraw");

        // uint256 lockPeriod = stakingPlans[_planId].lockPeriod;
        // require(block.timestamp > firstDepositDate + lockPeriod, "Forbidden, You can't withdraw before lockPeriod");

        return userStakingBalanceTotal;
    }

    function _afterWithdrawalStakingTransfer(uint _planId, uint _amount, uint _userStakingBalanceTotal) internal returns (uint) {
        stakingRecord memory tmpUserStakingWithdraw = stakingRecord({
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
        stakingRecord[] memory tmpUserStakingDepositBalances = userStakingDepositBalance[msg.sender][_planId];
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
        stakingRecord[] memory tmpUserStakingWithdrawalBalances = userStakingWithdrawalBalance[msg.sender][_planId];
        uint256 userStakingWithdrawalBalanceTotal;
        for (uint i = 0; i < tmpUserStakingWithdrawalBalances.length; i++) {
            userStakingWithdrawalBalanceTotal += tmpUserStakingWithdrawalBalances[i].amount;
        }

        return userStakingWithdrawalBalanceTotal;
    }

    function deleteStakers() internal {
        for (uint i =0; i < stakers.length; i++) {
            if (stakers[i] == msg.sender) {
                delete(stakers[i]);
            }
        }
    }

    function DAOmint(uint _amount) onlyOwner external {
        _mint(owner(), _amount);
    }

}