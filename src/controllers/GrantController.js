const Grant = require("../models/Grant");
const GrantMember = require("../models/GrantMember");

const collection = require("../utils/collection");


class GrantController {
    async getAll(req, res) {
        const {status} = req.body;
        let filter = {};

        if (status) {
            filter = {status: status};
        }
        const grants = await Grant.find(filter);
        res.status(200).json(collection(true, "Successfully completed", grants, "SUCCESS"));

    }

    async getById(req, res) {
        const {id} = req.params;
        const grant = await Grant.findById(id);
        const members = await GrantMember.find({grant_id: id});

        res.json(collection(true, "Successfully completed", {grant, members}, "SUCCESS"));
    }

    async create(req, res) {

        const {title, domain, funded_by, amount, start_date, end_date, status, center_id} = req.body;
        const created_by = req.user.id

        const grants = await Grant.create({
            title,
            domain,
            funded_by,
            amount,
            start_date,
            end_date,
            status,
            center_id,
            created_by
        });

        res.status(201).json(collection(true, "Added Grant Successfully", null, "SUCCESS"));
    }

    async update(req, res) {

        const {id} = req.params;
        const {title, domain, funded_by, amount, start_date, end_date, center_id} = req.body;

        const grant = await Grant.findByIdAndUpdate(id,
            {title, domain, funded_by, amount, start_date, end_date, center_id},
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json(collection(true, "Updated Successfully", grant, "SUCCESS"));
    }

    async delete(req, res) {

        const {id} = req.params;
        await Grant.findByIdAndDelete(id);
        await GrantMember.deleteMany({grant_id: id});

        res.json(collection(true, "Deleted Successfully", null, "SUCCESS"));
    }

    async editGrantStatus(req, res) {
        const {id} = req.params;
        const grant = await Grant.findByIdAndUpdate(id, {status: req.body.status}, {new: true});

        res.status(200).json(collection(true, "Updated Successfully", grant, "SUCCESS"));
    }

    async addMember(req, res) {
        const {grant_id, researcher_id, member_role} = req.body;

        const member = await GrantMember.create({grant_id, researcher_id, member_role});

        res.status(201).json(collection(true, "Added member Successfully", null, "SUCCESS"));
    }
}

module.exports = new GrantController();
