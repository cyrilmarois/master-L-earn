// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


/**
 * @title The library to handle the MLE token.
 * @author Maxence Guillemain d'Echon
**/
library MLEUtils {
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

}