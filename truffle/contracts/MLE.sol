// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MLEUtils.sol";

/**
 * @title The smart contract to handle the MLE token, and interractions between :
 * - the students,
 * - the teachers,
 * - the recruiters.
 * @author Cyril Marois & Maxence Guillemain d'Echon
**/
contract MLE is ERC20, ERC20Votes, Ownable {

/******************************** STATE VARIABLES ********************************/

    mapping (address => MLEUtils.Student) students;
    mapping (address => MLEUtils.Teacher) teachers;
    mapping (address => MLEUtils.Recruiter) recruiters;

    mapping (address => uint256) formationStakingBalance;

    MLEUtils.TeacherFormation[] public formations;
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
    event RecruitmentReward(address studentAddress, uint16 jobId);


/******************************* DEFAULT FUNCTIONS *******************************/

    /**
     * @notice Initializes the contract.
    **/
    constructor() ERC20("Master L&Earn", "MLE") Ownable() ERC20Permit("Master L&Earn") {
        _mint(msg.sender, INITIAL_SUPPLY);
        //0x5666eD746E98FA440ceD3714d5915c2556888a5c
        address teacher1 = 0xC2d1a543861Ea9A99FBd57db0F8820026c887768;
        address student1 = 0xE38613fb92CAB66312C2A7110836A43CC4BA9CF3;
        // address student2 = 0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB;
        // address recruiter1 = 0x617F2E2fD72FD9D5503197092aC168c91465E7f2;

        //teacher
        transfer(teacher1, 1000e18);

        //student
        transfer(student1, 1000e18);
        // transfer(student2, 1000e18);

        // recruiter
        // transfer(recruiter1, 1000e18);

    }

    receive() external payable {}
    fallback() external payable {}

/*********************************** MODIFIERS ***********************************/
/*********************************** FUNCTIONS ***********************************/
/***************** UTILS ********************/

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

    function register(bool _asStudent, bool _asTeacher, bool _asRecruiter) external {
        if (_asStudent) {
            students[msg.sender].isRegistered = true;
            emit StudentRegistered(msg.sender);
        }
        if (_asTeacher) {
            teachers[msg.sender].isRegistered = true;
            emit TeacherRegistered(msg.sender);
        }
        if (_asRecruiter) {
            recruiters[msg.sender].isRegistered = true;
            emit RecruiterRegistered(msg.sender);
        }
    }

    function getAnnounceForRecruiter (address _recruiterAddress, uint16 _announceId)
    external view returns(MLEUtils.Announce memory) {
        require (recruiters[_recruiterAddress].isRegistered, "Recruiter address not registered");
        require (_announceId < recruiters[_recruiterAddress].announces.length, "Announce not found");
        return recruiters[_recruiterAddress].announces[_announceId];
    }

    function getFormations() external view returns(MLEUtils.TeacherFormation[] memory) {
        return formations;
    }

    function getFormationForTeacher (address _teacherAddress, uint16 _formationId)
    external view returns(MLEUtils.TeacherFormation memory) {
        require (teachers[_teacherAddress].isRegistered, "Teacher address not registered");
        require (_formationId < teachers[_teacherAddress].formations.length, "Formation not found");
        return teachers[_teacherAddress].formations[_formationId];
    }

    function getFormationForStudent (address _studentAddress, uint16 _formationId)
    external view returns(MLEUtils.StudentFormation memory) {
        require (students[_studentAddress].isRegistered, "Student address not registered");
        require (_formationId < students[_studentAddress].formations.length, "Formation not found");
        return students[_studentAddress].formations[_formationId];
    }

    function getJobsForStudent (address _studentAddress, uint16 _jobId)
    external view returns(MLEUtils.Job memory) {
        require (students[_studentAddress].isRegistered, "Student address not registered");
        require (_jobId < students[_studentAddress].jobs.length, "Formation not found");
        return students[_studentAddress].jobs[_jobId];
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

/********** FORMATIONS FUNCTIONS ************/


    function postFormation (
        uint8 _modulesCount,
        uint32 _duration,
        uint _price,
        string memory _title,
        string[] memory _tags
    ) external {
        address[] memory stds;
        MLEUtils.TeacherFormation memory newTeacherFormation;
        newTeacherFormation = MLEUtils.TeacherFormation (
            _modulesCount,
            0,
            0,
            _duration,
            uint128(block.timestamp),
            _price,
            _title,
            _tags,
            stds
        );
        teachers[msg.sender].formations.push(newTeacherFormation);
        formations.push(newTeacherFormation);

        emit FormationPublished(msg.sender, formations.length - 1);
    }

    function validateUserModule (address _studentAddress, uint16 _teacherFormationId) external {
        require (students[_studentAddress].isRegistered, "Student address not registered");

        uint16 _id = _retrieveStudentFormationId(_studentAddress, msg.sender, _teacherFormationId);
        MLEUtils.StudentFormation memory _studentFormation = students[_studentAddress].formations[_id];
        require (!_studentFormation.isCertified, "Formation already certified");
        require (_studentFormation.validatedModulesNumber < teachers[msg.sender].formations[_teacherFormationId].modulesCount, "Last module already validated");

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
         = MLEUtils._removeAddressFromTab(teachers[msg.sender].formations[_teacherFormationId].students,
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

        MLEUtils.TeacherFormation memory _teacherFormation = teachers[_teacherAddress].formations[_teacherFormationId];

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
        MLEUtils.StudentFormation memory _studentFormation =
            MLEUtils.StudentFormation (_teacherAddress, _teacherFormationId, 0, false, false, cashback);
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
        recruiters[msg.sender].announces.push( MLEUtils.Announce (
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
        string memory _title
    ) external {
        require (students[_studentAddress].isRegistered, "Student address not registered");
        students[_studentAddress].jobs.push( MLEUtils.Job (
            false,
            msg.sender,
            _announceId,
            0,
            _title,
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

    function DAOmint(uint _amount) onlyOwner external {
        _mint(owner(), _amount);
    }

}