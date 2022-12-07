// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


/**
 * @title The smart contract to handle the MLE token, and interractions between :
 * - the students,
 * - the teachers,
 * - the recruiters.
 * @author Cyril Marois & Maxence Guillemain d'Echon
**/
contract Learn is ERC20 {
/******************************** STRUCTS & ENUMS ********************************/

    struct TeacherFormation {
        uint8 modulesCount;
        uint32 ratingsSum;
        uint32 ratingsCount;
        uint32 duration;         // exprimed in seconds
        uint128 creationDate;     // exprimed in seconds since 1970
        uint price;            // exprimed in MLE
        string title;
        string description;
        string[] ressources;
        string[] tags;
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
        uint creationDate;     // exprimed in seconds since 1970
        uint exprirationDate;     // exprimed in seconds since 1970
        string title;
        string description;
        string[] ressources;
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


/******************************** STATE VARIABLES ********************************/

    mapping (address => Student) students;
    mapping (address => Teacher) teachers;
    mapping (address => Recruiter) recruiters;

    mapping (address => uint256) stakingBalance;
    mapping (address => uint256) formationStakingBalance;

    address DAOAddress;

    uint constant INITIAL_SUPPLY = 1000000;
    uint constant MAX_SUPPLY = 21000000;
    uint constant ANNOUNCE_POST_PRICE = 50;
    uint constant RECRUITMENT_COMMISSION = 10; // % 
    uint constant FORMATION_COMMISSION = 3; // % 
    uint constant MAX_GRADE = 50;
    

/************************************ EVENTS *************************************/

    event StudentRegistered(address studentAddress);
    event TeacherRegistered(address teacherAddress);
    event RecruiterRegistered(address recruiterAddress);

    event FormationPublished(address teacherAddress, uint teacherFormationId);
    event FormationCertified(address teacherAddress, uint teacherFormationId, address studentAddress);
    event AnnouncePublished(uint announceId, address recruiterAddress);
    
    event StakeDeposit(uint256 amount, address from);
    event StakeWithdrawal(uint256 amount, address from);


/******************************* DEFAULT FUNCTIONS *******************************/
    
    /**
     * @notice Initializes the contract.
    **/
    constructor() ERC20("Master Learn", "MLE") {
        DAOAddress = msg.sender;
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    receive() external payable {}
    fallback() external payable {}

    
/*********************************** MODIFIERS ***********************************/

    modifier onlyTeachers() {
        require(teachers[msg.sender].isRegistered, "Denied: is not a teacher");
        _;
    }

    modifier onlyStudents() {
        require(students[msg.sender].isRegistered, "Denied: is not a student");
        _;
    }

    modifier onlyRecruiters() {
        require(recruiters[msg.sender].isRegistered, "Denied: is not a recruiter");
        _;
    }

/*********************************** FUNCTIONS ***********************************/

/********** FORMATIONS FUNCTIONS ************/

    function postFormation(
        uint8 _modulesCount,
        uint16 _duration,
        uint _price, 
        string memory _title,
        string memory _description,
        string[] memory _ressources,
        string[] memory _tags
    ) external onlyTeachers {
        teachers[msg.sender].formations.push( TeacherFormation (
            _modulesCount,
            0,
            0,
            _duration,
            uint128(block.timestamp), 
            _price,
            _title,
            _description,
            _ressources,
            _tags
        ));
    }

    function validateUserModule(address _studentAddress, uint16 _teacherFormationId) external onlyTeachers {
        require (students[_studentAddress].isRegistered, "Student address not registered");

        uint16 _id = _retrieveStudentFormationId(_studentAddress, _teacherFormationId);
        StudentFormation memory _studentFormation = students[_studentAddress].formations[_id];
        require (!_studentFormation.isCertified, "Formation already certified");

        students[_studentAddress].formations[_id].validatedModulesNumber++;

        // Cashback
        _transfer(DAOAddress, _studentAddress, _studentFormation.cashback);
        formationStakingBalance[msg.sender] -= _studentFormation.cashback;
    }

    function certifyUserFormation(address _studentAddress, uint16 _teacherFormationId) external onlyTeachers {
        require (students[_studentAddress].isRegistered, "Student address not registered");

        uint16 _id = _retrieveStudentFormationId(_studentAddress, _teacherFormationId);
        require (!students[_studentAddress].formations[_id].isCertified, "Formation already certified");

        students[_studentAddress].formations[_id].isCertified = true;
    }

    function _retrieveStudentFormationId(address _studentAddress, uint16 _teacherFormationId) 
        internal view returns(uint16) {
        // Retrieve within the formations owned by the sender and followed by the student the formation which:
        // - has the teacherAddress msg.sender 
        // - has the id _teacherFormationId 
        bool _found;
        uint16 _id;
        for (; _id < students[_studentAddress].formations.length; _id++) {
            if (students[_studentAddress].formations[_id].teacherAddress == msg.sender 
                && students[_studentAddress].formations[_id].formationId == _teacherFormationId) {
                _found = true;
                break;
            }
        }
        require (_found, "formation not found");
        return _id;
    }

    function buyFormation(address _teacherAddress, uint16 _teacherFormationId) external onlyStudents {
        require (teachers[_teacherAddress].isRegistered, "Student address not registered");
        require (_teacherFormationId < teachers[_teacherAddress].formations.length, "Formation not found");
        
        // Add new StudentFormation to student
        TeacherFormation memory _teacherFormation = teachers[_teacherAddress].formations[_teacherFormationId];
        uint cashback = _teacherFormation.price / _teacherFormation.modulesCount ;
        StudentFormation memory _studentFormation = 
            StudentFormation(_teacherAddress, _teacherFormationId, 0, false, false, cashback);
        students[msg.sender].formations.push(_studentFormation);

        require (balanceOf(msg.sender) >= 2 * _teacherFormation.price, "Insufficient balance");
        uint _commission = _teacherFormation.price * FORMATION_COMMISSION / 100;
        uint _teacherCut = _teacherFormation.price - _commission;
        require (transfer(_teacherAddress, _teacherCut));
        require (transfer(DAOAddress, _teacherFormation.price + _commission));
        formationStakingBalance[msg.sender] += _teacherFormation.price;
    }

    function evaluateFormation(address _teacherAddress, uint16 _teacherFormationId, uint8 grade) external onlyStudents {
        require (grade <= MAX_GRADE, "Grade too high");
        require (teachers[_teacherAddress].isRegistered, "Student address not registered");
        require (_teacherFormationId < teachers[_teacherAddress].formations.length, "Formation not found");
        uint16 _id = _retrieveStudentFormationId(msg.sender, _teacherFormationId);
        // TBD conditions de droit de notation :
        require(students[msg.sender].formations[_id].isCertified, "Student cannot evaluate yet");
        require(!students[msg.sender].formations[_id].isRated, "Student already evaluated this formation");
        students[msg.sender].formations[_id].isRated = true;
        teachers[_teacherAddress].formations[_teacherFormationId].ratingsSum += grade;
        teachers[_teacherAddress].formations[_teacherFormationId].ratingsCount ++;
    }


/******* ANNOUNCES & JOBS FUNCTIONS *********/

    function postAnnounce(
        uint _exprirationDate, 
        string memory _title,
        string memory _description,
        string[] memory _ressources,
        string[] memory _tags
    ) external onlyRecruiters {
        require (transfer(DAOAddress, ANNOUNCE_POST_PRICE), "Not enough tokens");
        address[] memory candidates;
        recruiters[msg.sender].announces.push( Announce (
            block.timestamp,
            _exprirationDate, 
            _title,
            _description,
            _ressources,
            _tags,
            candidates
        ));
    }

    function suggestJob(
        address _studentAddress, 
        uint16 _announceId, 
        string memory _title, 
        string memory _description
    ) external onlyRecruiters {
        require (students[_studentAddress].isRegistered, "Student address not registered");
        students[_studentAddress].jobs.push(Job(
            false,
            msg.sender,
            _announceId,
            0,
            _title,
            _description
        ));
    }

    function applyAnnounce(address _recruiterAddress, uint16 _announceId) external onlyStudents {
        require (recruiters[_recruiterAddress].isRegistered, "Recruiter address not registered");
        require (_announceId < recruiters[_recruiterAddress].announces.length, "Announce not found");
        
        bool _found;
        // TBD : limit size of candidates tab ?
        for (uint _id; _id < recruiters[_recruiterAddress].announces[_announceId].candidates.length; _id++) {
            if (recruiters[_recruiterAddress].announces[_announceId].candidates[_id] == msg.sender)
                _found = true;
        }
        require (!_found, "Announce already apllied");

        recruiters[_recruiterAddress].announces[_announceId].candidates.push(msg.sender);
    }

    function answerJobOffer(bool _doAccept, uint16 _jobId) external onlyStudents {
        require (_jobId < students[msg.sender].jobs.length, "Job not found");

        students[msg.sender].jobs[_jobId].isAccepted = _doAccept; 
    }

/************ TOKEN FUNCTIONS ***************/

    function buyToken() external {}

    function stakeDeposit(uint256 _amount) external {
        emit StakeDeposit(_amount, msg.sender);
    }

    function stakeWithdraw(uint256 _amount) external {
        emit StakeWithdrawal(_amount, msg.sender);
    }

}