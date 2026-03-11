const Institute = require("../models/Institute");
const College = require("../models/College");
const Department = require("../models/Department");
const ResearchCenter = require("../models/ResearchCenter");

const collection = require("../utils/collection");

class InstituteController {
    async getAllInstitute(req, res) {

        const institutes = await Institute.find();
        res.status(200).json(collection(true, "Successfully completed", institutes, "SUCCESS"));

    }

    async getCollegesForInstitute(req, res) {
        const {institutes_id} = req.params;
        const colleges = await College.find({institute_id: institutes_id});
        if (!colleges || colleges.length === 0) {
            throw new Error("Colleges don't Exist");
        }
        res.status(200).json(collection(true, "Successfully completed", colleges, "SUCCESS"));
    }

    async getDepartmentsForCollege(req, res) {
        const {college_id} = req.params;
        const departments = await Department.find({college_id: college_id});
        if (!departments || departments.length === 0) {
            throw new Error("Departments don't Exist");
        }
        res.status(200).json(collection(true, "Successfully completed", departments, "SUCCESS"));
    }

    async getResearchCenterForInstitute(req, res) {
        const {institutes_id} = req.params;
        const researchCenters = await ResearchCenter.find({institute_id: institutes_id});
        if (!researchCenters || researchCenters.length === 0) {
            throw new Error("Research Centers don't Exist");
        }
        res.status(200).json(collection(true, "Successfully completed", researchCenters, "SUCCESS"));
    }


}

module.exports = new InstituteController();
