const Researcher = require("../models/Researcher");
const User = require("../models/User");

const passwordService = require('../utils/passwordService');
const collection = require("../utils/collection");

class ResearcherController {
    async create(req, res, next) {
        try {
            const {
                first_name, last_name, email, password, phone, institute_id, college_id, department_id,
                orcid_id, scopus_id, google_scholar_id, research_theme, hindex
            } = req.body;

            const existEmail = await User.findOne({email});

            if (existEmail) {
                throw new Error('Your Email Already Exist')
            }

            // Check From Strength Password
            try {
                passwordService.validatePasswordStrength(password);
            } catch (error) {
                return res.status(400).json(collection(false, error.message, null, "ERROR"));
            }
            const hashPassword = await passwordService.hashPassword(password);
            const user = await User.create({
                first_name,
                last_name,
                email,
                password: hashPassword,
                phone,
                institute_id,
                college_id,
                department_id,
                role: "researcher"
            })
            const researcher = await Researcher.create({
                user_id: user._id,
                orcid_id,
                scopus_id,
                google_scholar_id,
                research_theme,
                hindex
            })

            res.status(201).json(collection(true, "Added Researcher Successfully", null, "SUCCESS"));

        } catch (error) {
            if (error.user && error.user._id) {
                await User.findByIdAndDelete(error.user._id);
            }
            if (error.researcher && error.researcher._id) {
                await Researcher.findByIdAndDelete(error.researcher._id);
            }

            if (error.code === 11000) {
                const duplicateError = new Error("User already has a researcher profile");
                duplicateError.statusCode = 409;
                return next(duplicateError);
            }
            next(error);
        }
    }

    async update(req, res, next) {
        const {id} = req.params;
        const {
            first_name, last_name, email, phone, institute_id, college_id, department_id,
            orcid_id, scopus_id, google_scholar_id, research_theme, hindex
        } = req.body;

        const existingResearcher = await Researcher.findOne({_id: id, is_active: true});
        if (!existingResearcher) {
            const error = new Error("Researcher not found");
            error.statusCode = 404;
            return next(error);
        }

        const user = await User.findByIdAndUpdate(
            existingResearcher.user_id,
            {first_name, last_name, email, phone, institute_id, college_id, department_id},
            {
                new: true,
                runValidators: true,
            });

        const researcher = await Researcher.findByIdAndUpdate(id,
            {orcid_id, scopus_id, google_scholar_id, research_theme, hindex},
            {
                new: true,
                runValidators: true,
            });

        res.status(200).json(collection(true, "Edited Researcher Successfully", {user, researcher}, "SUCCESS"));
    }

    async delete(req, res, next) {
        const {id} = req.params;
        const existingResearcher = await Researcher.findOne({_id: id, is_active: true});
        if (!existingResearcher) {
            const error = new Error("Researcher not found");
            error.statusCode = 404;
            return next(error);
        }

        await Researcher.findByIdAndUpdate(id, {
            is_active: false
        });

        res.status(200).json(collection(true, "Deleted successfully", null, "DEACTIVATED"));

    }

    async getById(req, res, next) {
        const {id} = req.params;
        const existingResearcher = await Researcher.findOne({_id: id, is_active: true})
            .populate({
                path: 'user_id',
                populate: [{
                    path: 'institute_id',
                    select: 'institute_name',
                }, {
                    path: 'college_id',
                    select: 'college_name',
                }, {
                    path: 'department_id',
                    select: 'department_name'
                }]
            });
        if (!existingResearcher) {
            const error = new Error("Researcher not found");
            error.statusCode = 404;
            return next(error);
        }
        res.status(200).json(collection(true, "Successfully completed", existingResearcher, "SUCCESS"));

    }

    async getAll(req, res) {
        const {search} = req.body;

        const matchStage = {
            is_active: true
        };
        const pipeline = [
            {$match: matchStage},
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_id"
                }
            },
            {$unwind: "$user_id"}
        ];
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        {"user_id.email": {$regex: search, $options: "i"}},
                        {"user_id.first_name": {$regex: search, $options: "i"}},
                        {"user_id.last_name": {$regex: search, $options: "i"}}
                    ]
                }
            });
        }

        const researchers = await Researcher.aggregate(pipeline);

        res.status(200).json(collection(true, "Successfully completed", researchers, "SUCCESS"));
    }
}

module.exports = new ResearcherController();
