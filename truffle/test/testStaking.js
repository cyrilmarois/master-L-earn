const MLE = artifacts.require("MLE");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const constants = require('@openzeppelin/test-helpers/src/constants');


contract("MLE", accounts => {
    var owner = accounts[0];
    var teacher1 = accounts[1];
    var student1 = accounts[2];
    var student2 = accounts[3];
    var recruiter1 = accounts[4];
    var price = BN("200000000000000000000");
    var module_count = BN(3);

    before (async function() { 
      MLEInstance = await MLE.new({from: owner});
      
      await MLEInstance.transfer(teacher1, BN("2000000000000000000000"), {from: owner});
      await MLEInstance.transfer(student1, BN("2000000000000000000000"), {from: owner});
      await MLEInstance.transfer(student2, BN("2000000000000000000000"), {from: owner});
      await MLEInstance.transfer(recruiter1, BN("2000000000000000000000"), {from: owner});
    });

    it('Transfer tokens correctly', async() => {
      
    });


})
