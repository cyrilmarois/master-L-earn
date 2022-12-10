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

    before (async function() { 
      MLEInstance = await MLE.new({from: owner})
    });

    it('Transfer tokens correctly', async() => {
      await MLE.transfer(teacher1, BN(2000e18), {from: owner});
      expect (await MLE.balanceof(teacher1)).to.be.bignumber.equal(BN(2000e18));
    });

})
