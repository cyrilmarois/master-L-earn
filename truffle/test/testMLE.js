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
    before (async function() { 
      MLEInstance = await MLE.new({from: owner})
    });

    it('Transfer tokens correctly', async() => {
      await MLEInstance.transfer(teacher1, BN("2000000000000000000000"), {from: owner});
      expect (await MLEInstance.balanceOf(teacher1)).to.be.bignumber.equal(BN("2000000000000000000000"));
      await MLEInstance.transfer(student1, BN("2000000000000000000000"), {from: owner});
      await MLEInstance.transfer(student2, BN("2000000000000000000000"), {from: owner});
      await MLEInstance.transfer(recruiter1, BN("2000000000000000000000"), {from: owner});
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
        BN(3), // Module counts
        BN(100), // Duration
        price, // MLE price
        "Algorithmique", // Title
        ["algo", "maths", "info"], // Tags
        {from: teacher1});
      
      var formation = await MLEInstance.getFormationForTeacher(teacher1, 0, {from:student1});
      assert.equal(formation.modulesCount, 3);    
      expect (formation.price).to.be.bignumber.equal(price);
    });

    it('Allows a student to buy a formation', async() => {
      var balanceOfTeacherBefore = await MLEInstance.balanceOf(teacher1);
      var balanceOfStudentBefore = await MLEInstance.balanceOf(student1);
      await MLEInstance.buyFormation(teacher1, 0, {from: student1});
      
      var balanceOfTeacherAfter = await MLEInstance.balanceOf(teacher1);
      var balanceOfStudentAfter = await MLEInstance.balanceOf(student1);
      
      var formation = await MLEInstance.getFormationForTeacher(teacher1, 0, {from:teacher1});
      assert.equal(formation.students[0], student1);

      var s = balanceOfStudentBefore.sub(balanceOfStudentAfter);
      var price2 = price.mul(BN(2));
      expect (s).to.be.bignumber.equal(price2);

    });

    it('Allows a teacher to validate / certify a formation for a student', async() => {
      await MLEInstance.validateUserModule(student1, 0, {from: teacher1});
      
      var formation = await MLEInstance.getFormationForTeacher(teacher1, 0, {from:teacher1});
      assert.equal(formation.students[0], student1);
    });
    



    




})
