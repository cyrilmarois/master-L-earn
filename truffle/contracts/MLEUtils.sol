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
contract MLEUtils {
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
}

/**

(bool success, bytes memory data) = MLEutils.delegatecall(
            abi.encodeWithSignature("_removeAddressFromTab(address[] memory _tab, address _address)", 
            teachers[msg.sender].formations[_teacherFormationId].students, _studentAddress)
        );
        require (success);
        teachers[msg.sender].formations[_teacherFormationId].students = abi.decode(data, (address[]));
 */