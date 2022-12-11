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

    it('Allows a student to buy a formation', async() => {
      var balanceOfTeacherBefore = await MLEInstance.balanceOf(teacher1);
      var balanceOfStudentBefore = await MLEInstance.balanceOf(student1);
      await MLEInstance.buyFormation(teacher1, 0, {from: student1});
      
      var balanceOfTeacherAfter = await MLEInstance.balanceOf(teacher1);
      var balanceOfStudentAfter = await MLEInstance.balanceOf(student1);
      
      var formation = await MLEInstance.getFormationForTeacher(teacher1, {from:teacher1});
      expect(formation[0].students[0]).equal(student1);

      var s = balanceOfStudentBefore.sub(balanceOfStudentAfter);
      expect (s).to.be.bignumber.equal(price.mul(BN(2)));
      
      s = balanceOfTeacherAfter.sub(balanceOfTeacherBefore);
      var fee = price.mul(BN(3)).div(BN(100));
      expect (s).to.be.bignumber.equal(price.sub(fee));

    });

    it('Allows a teacher to validate a formation for a student', async() => {
      
      var balanceOfStudentBefore = await MLEInstance.balanceOf(student1);
      await MLEInstance.validateUserModule(student1, 0, {from: teacher1});
      var balanceOfStudentAfter = await MLEInstance.balanceOf(student1);
      
      var s = balanceOfStudentAfter.sub(balanceOfStudentBefore);
      expect (s).to.be.bignumber.equal(price.div(module_count));
      
      var formation = await MLEInstance.getFormationForStudent(student1, {from:teacher1});
      expect (formation[0].validatedModulesNumber).to.be.bignumber.equal(BN(1)); 
      expect (formation[0].teacherAddress).equals(teacher1); 
      expect (formation[0].isCertified).equals(false);
      expect (formation[0].isRated).equals(false);

      
      await MLEInstance.validateUserModule(student1, 0, {from: teacher1});
      formation = await MLEInstance.getFormationForStudent(student1, {from:teacher1});
      expect (formation[0].validatedModulesNumber).to.be.bignumber.equal(BN(2)); 
      await MLEInstance.validateUserModule(student1, 0, {from: teacher1});
      formation = await MLEInstance.getFormationForStudent(student1, {from:teacher1});
      expect (formation[0].validatedModulesNumber).to.be.bignumber.equal(BN(3));

      await expectRevert(MLEInstance.validateUserModule(student1, 0, {from: teacher1}), "Last module already validated");
      formation = await MLEInstance.getFormationForStudent(student1, {from:teacher1});
      expect (formation[0].validatedModulesNumber).to.be.bignumber.equal(BN(3)); 

    });

    it('Does not allow an uncertified student to evaluate a formation', async() => {
      await expectRevert(MLEInstance.evaluateFormation(teacher1, 0, 35, {from: student1}), "Student cannot evaluate yet");
    });

    it('Allows a teacher to certify a formation for a student', async() => {
      await MLEInstance.certifyUserFormation(student1, 0, {from: teacher1});
      var formation = await MLEInstance.getFormationForStudent(student1, {from:teacher1});
      expect (formation[0].isCertified).equals(true);
    });

    it('Allows a certified student to evaluate a formation', async() => {
      await MLEInstance.evaluateFormation(teacher1, 0, 35, {from: student1});
      var formation = await MLEInstance.getFormationForTeacher(teacher1, {from:teacher1});
      expect (formation[0].ratingsSum).to.be.bignumber.equal(BN(35));
      expect (formation[0].ratingsCount).to.be.bignumber.equal(BN(1));
    });

    it('Allows a recruiter to post an announce', async() => {
      await MLEInstance.postAnnounce(
        "Dev react, 45K$", 
        ["dev", "js", "react", "web"], 
        {from: recruiter1});
      
      var announce = await MLEInstance.getAnnounceForRecruiter(recruiter1, {from:recruiter1});
      expect(announce[0].title).equals("Dev react, 45K$");    
    }); 

    it('Allows a student to apply to an announce', async() => {
      await MLEInstance.applyAnnounce(recruiter1, 0, {from: student1});
      var announce = await MLEInstance.getAnnounceForRecruiter(recruiter1, {from:recruiter1});
      expect(announce[0].candidates[0]).equals(student1);
    });

    it('Allows a recruiter to offer a job to a student', async() => {
      await MLEInstance.offerJob(student1, 0, "React dev, 40K, Paris", {from: recruiter1});
      var job = await MLEInstance.getJobsForStudent(student1, {from:student1});
      expect(job[0].title).equals("React dev, 40K, Paris");
      expect(job[0].recruiterAddress).equals(recruiter1);
      expect(job[0].isAccepted).equals(false);
    });

    it('Allows a student to accept a job offer', async() => {
      await MLEInstance.answerJobOffer(true, 0, {from: student1});
      var job = await MLEInstance.getJobsForStudent(student1, {from:student1});
      expect(job[0].isAccepted).equals(true);
    });

    it('Allows a student to prove her Id to a recruiter', async() => {
      challenge = BN(web3.utils.randomHex(32));
      await MLEInstance.proveId(0, challenge, {from: student1});
      await expectRevert(MLEInstance.verifyId(student1, 0, challenge.add(BN(1)), {from: recruiter1}), "Id not verified");
      var verifId = await MLEInstance.verifyId(student1, 0, challenge, {from: recruiter1});
      expectEvent (verifId, "RecruitmentReward", {studentAddress: student1, jobId:BN(0)});
    });

})
