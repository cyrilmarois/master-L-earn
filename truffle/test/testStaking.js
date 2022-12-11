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

    it('Allows an MLE holder to stake on plan 0', async() => {
      var stakeAmount = BN("100000000000000000000");
      var balanceOfTeacherBefore = await MLEInstance.balanceOf(teacher1);
      var balanceOfContractBefore = await MLEInstance.balanceOf(MLEInstance.address);

      await MLEInstance.stakeDeposit(stakeAmount, 0, {from: teacher1});
      
      var balanceOfTeacherAfter = await MLEInstance.balanceOf(teacher1);
      var balanceOfContractAfter = await MLEInstance.balanceOf(MLEInstance.address);
      var stakeReal = balanceOfTeacherBefore.sub(balanceOfTeacherAfter);
      expect (stakeReal).to.be.bignumber.equal(stakeAmount);
      
      stakeReal = balanceOfContractAfter.sub(balanceOfContractBefore);
      expect (stakeReal).to.be.bignumber.equal(stakeAmount);
    });

    it('Does not allow an MLE staker to withdraw before unlock', async() => {
      var stakeAmount = BN("100000000000000000000");
      var balanceOfTeacherBefore = await MLEInstance.balanceOf(teacher1);
      var balanceOfContractBefore = await MLEInstance.balanceOf(MLEInstance.address);

      await expectRevert(MLEInstance.stakeWithdraw(stakeAmount, 0, {from: teacher1}), 
        "Error, You can't withdraw before lockPeriod.");
      
      var balanceOfTeacherAfter = await MLEInstance.balanceOf(teacher1);
      var balanceOfContractAfter = await MLEInstance.balanceOf(MLEInstance.address);
      expect (balanceOfTeacherBefore.sub(balanceOfTeacherAfter)).to.be.bignumber.equal(BN(0));
      expect (balanceOfContractAfter.sub(balanceOfContractBefore)).to.be.bignumber.equal(BN(0));
    });
    
    it('Allows an MLE staker to withdraw after unlock', async() => {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
      await delay(70*1000);
      var stakeAmount = BN("100000000000000000000");
      var balanceOfTeacherBefore = await MLEInstance.balanceOf(teacher1);
      var balanceOfContractBefore = await MLEInstance.balanceOf(MLEInstance.address);

      await MLEInstance.stakeWithdraw(stakeAmount, 0, {from: teacher1});
      
      var balanceOfTeacherAfter = await MLEInstance.balanceOf(teacher1);
      var balanceOfContractAfter = await MLEInstance.balanceOf(MLEInstance.address);
      expect (balanceOfTeacherBefore.sub(balanceOfTeacherAfter)).to.be.bignumber.equal(BN(0));
      expect (balanceOfContractAfter.sub(balanceOfContractBefore)).to.be.bignumber.equal(BN(0));
    });




})
