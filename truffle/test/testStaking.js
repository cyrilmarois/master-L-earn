const MLE = artifacts.require("MLE");
const MLEStaking = artifacts.require("MLEStaking");
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

      const { txHash } = await MLEInstance.stakeDeposit(stakeAmount, 0, {from: teacher1});
      
      expectEvent.inTransaction(txHash, MLEInstance, "StakeDeposit", {
        amount: stakeAmount, 
        from: teacher1, 
        planId: 0, 
        totalDeposit: stakeAmount 
      });
      
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
    
    it('Register users correctly', async() => {
      var register = await MLEInstance.register(false, true, false, {from: teacher1});
      expectEvent (register, "TeacherRegistered", {teacherAddress: teacher1});
      register = await MLEInstance.register(true, false, false, {from: student1});
      expectEvent (register, "StudentRegistered", {studentAddress: student1});
      register = await MLEInstance.register(true, false, false, {from: student2});
      expectEvent (register, "StudentRegistered", {studentAddress: student2});
      register = await MLEInstance.register(false, false, true, {from: recruiter1});
      expectEvent (register, "RecruiterRegistered", {recruiterAddress: recruiter1});
    });
    
    it('Allows a teacher to post a formation', async() => {
      await MLEInstance.postFormation(
        module_count, // Module counts
        BN(100), // Duration
        price, // MLE price
        "Algorithmique", // Title
        ["algo", "maths", "info"], // Tags
        {from: teacher1});
      
      var formation = await MLEInstance.getFormationForTeacher(teacher1, {from:student1});
      expect(formation[0].modulesCount).to.be.bignumber.equal(BN(3));    
      expect (formation[0].price).to.be.bignumber.equal(price);
    });

    it('Allows an MLE staker to withdraw after unlock', async() => {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
      await delay(15*1000);
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
