const MLE = artifacts.require("MLE");
const MLEStaking = artifacts.require("MLEStaking");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const constants = require('@openzeppelin/test-helpers/src/constants');


contract("MLE", accounts => {
    var MLEInstance;
    var MLEStakingInstance;
    var owner = accounts[0];
    var teacher1 = accounts[1];
    var student1 = accounts[2];
    var student2 = accounts[3];
    var recruiter1 = accounts[4];
    var price = BN("100000000000000000000");
    var module_count = BN(3);
    /*
    before (async function() { 
      MLEInstance = await MLE.new({from: owner});
      await MLEInstance.transfer(teacher1, BN("2000000000000000000000"), {from: owner});
    });
    it('Allows an MLE holder to stake', async() => {
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

    before (async function() { 
      MLEInstance = await MLE.new({from: owner});
      await MLEInstance.transfer(teacher1, BN("2000000000000000000000"), {from: owner});
    });
    it('Does not allow an MLE staker to withdraw before unlock', async() => {
      var stakeAmount = BN("100000000000000000000");
      await MLEInstance.stakeDeposit(stakeAmount, 1, {from: teacher1});
      var balanceOfTeacherBefore = await MLEInstance.balanceOf(teacher1);
      var balanceOfContractBefore = await MLEInstance.balanceOf(MLEInstance.address);
      await expectRevert(MLEInstance.stakeWithdraw(stakeAmount, 1, {from: teacher1}), 
        "You can't withdraw before lockPeriod.");
      var balanceOfTeacherAfter = await MLEInstance.balanceOf(teacher1);
      var balanceOfContractAfter = await MLEInstance.balanceOf(MLEInstance.address);
      expect (balanceOfTeacherBefore.sub(balanceOfTeacherAfter)).to.be.bignumber.equal(BN(0));
      expect (balanceOfContractAfter.sub(balanceOfContractBefore)).to.be.bignumber.equal(BN(0));
    });

    before (async function() { 
      MLEInstance = await MLE.new({from: owner});
      await MLEInstance.transfer(teacher1, BN("2000000000000000000000"), {from: owner});
    });
    it('Allows an MLE staker to withdraw after unlock', async() => {
      var stakeAmount = BN("100000000000000000000");
      await MLEInstance.stakeDeposit(stakeAmount, 1, {from: teacher1});
      var balanceOfTeacherBefore = await MLEInstance.balanceOf(teacher1);
      var balanceOfContractBefore = await MLEInstance.balanceOf(MLEInstance.address);
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      await delay(10*1000);
      await MLEInstance.register(false, true, false, {from: teacher1});
      await MLEInstance.register(false, true, false, {from: teacher1});
      await MLEInstance.register(false, true, false, {from: teacher1});
      await MLEInstance.register(false, true, false, {from: teacher1});
      await MLEInstance.register(false, true, false, {from: teacher1});
      await MLEInstance.register(false, true, false, {from: teacher1});
      await MLEInstance.register(false, true, false, {from: teacher1});
      await MLEInstance.register(false, true, false, {from: teacher1});
      await MLEInstance.register(false, true, false, {from: teacher1});
      await MLEInstance.register(false, true, false, {from: teacher1});
      await MLEInstance.register(false, true, false, {from: teacher1});
      await MLEInstance.stakeWithdraw(stakeAmount, 1, {from: teacher1});
      
      var balanceOfTeacherAfter = await MLEInstance.balanceOf(teacher1);
      var balanceOfContractAfter = await MLEInstance.balanceOf(MLEInstance.address);
      expect (balanceOfTeacherAfter.sub(balanceOfTeacherBefore)).to.be.bignumber.equal(stakeAmount);
      expect (balanceOfContractBefore.sub(balanceOfContractAfter)).to.be.bignumber.equal(stakeAmount);
    });
    */

    before (async function() { 
      MLEInstance = await MLE.new({from: owner});
      var addressOfMLEStaking = await MLEInstance.mleStaking();
      MLEStakingInstance = await MLEStaking.at(addressOfMLEStaking);
      await MLEInstance.register(false, true, false, {from: teacher1});
      await MLEInstance.transfer(teacher1, BN("2000000000000000000000"), {from: owner});
      await MLEInstance.register(true, false, false, {from: student1});
      await MLEInstance.transfer(student1, BN("2000000000000000000000"), {from: owner});
      await MLEInstance.register(true, false, false, {from: student2});
      await MLEInstance.transfer(student2, BN("2000000000000000000000"), {from: owner});
      await MLEInstance.register(false, false, true, {from: recruiter1});
      await MLEInstance.transfer(recruiter1, BN("2000000000000000000000"), {from: owner});
    });
    it('Allows an MLE staker to perceive profits', async() => {

      // teacher1 and student1 stake 100 MLE each 
      var stakeAmount = BN("100000000000000000000");
      var teacherStakeValueBefore = await MLEStakingInstance.getUsertotalStakedValue(teacher1, 0);
      var studentStakeValueBefore = await MLEStakingInstance.getUsertotalStakedValue(student1, 0);      
      await MLEInstance.stakeDeposit(stakeAmount, 0, {from: teacher1});
      await MLEInstance.stakeDeposit(stakeAmount, 0, {from: student1});

      // profits are generated on the formation and job workflows
      await MLEInstance.postFormation(
        module_count, // Module counts
        BN(100), // Duration
        price, // MLE price
        "Algorithmique", // Title
        ["algo", "maths", "info"], // Tags
        {from: teacher1});
      await MLEInstance.buyFormation(teacher1, 0, {from: student1});
      await MLEInstance.buyFormation(teacher1, 0, {from: student2});
      await MLEInstance.postAnnounce(
        "Dev react, 45K$", 
        ["dev", "js", "react", "web"], 
        {from: recruiter1});

      // 
      console.log({profits:(await MLEInstance.profitToDistribute()).toString()});
      console.log({contractBalance:(await MLEInstance.balanceOf(MLEInstance.address)).toString()});
      console.log({teacher1Balance:(await MLEInstance.balanceOf(teacher1)).toString()});
      console.log({student1Balance:(await MLEInstance.balanceOf(student1)).toString()});
      
      
      await MLEInstance.distributeProfits({from:owner});

      
      console.log({contractBalance:(await MLEInstance.balanceOf(MLEInstance.address)).toString()});
      console.log({teacher1Balance:(await MLEInstance.balanceOf(teacher1)).toString()});
      console.log({student1Balance:(await MLEInstance.balanceOf(student1)).toString()});
      
      
      var teacherStakeValueAfter = await MLEStakingInstance.getUsertotalStakedValue(teacher1, 0);
      var studentStakeValueAfter = await MLEStakingInstance.getUsertotalStakedValue(student1, 0);
      
      // expect (teacherStakeValueAfter.sub(teacherStakeValueBefore)).to.be.bignumber.equal(BN("1"));
      // expect (studentStakeValueAfter.sub(studentStakeValueBefore)).to.be.bignumber.equal(BN("1"));
    });
    



})
