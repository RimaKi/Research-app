const collection = require("../utils/collection");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const Researcher = require("../models/Researcher");

const passwordService = require('../utils/passwordService');
const tokenService = require('../utils/tokenService');
const argon2 = require("argon2");

class AuthController {
    async register(req, res) {

        const {first_name, last_name, email, password, phone, institute_id, college_id, department_id} = req.body;

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

        const hashed = await passwordService.hashPassword(password);
        const user = await User.create({
            first_name,
            last_name,
            email,
            password: hashed,
            phone,
            institute_id,
            college_id,
            department_id
        });


        // Generate tokens
        const accessToken = tokenService.generateAccessToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });

        const refreshToken = tokenService.generateRefreshToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });

        RefreshToken.create({
            user_id: user._id,
            token_hash: await passwordService.hashPassword(refreshToken)
        });

        return res.status(200).json(
            collection(true, "Signed Up Successfully", {user, accessToken, refreshToken}, "SUCCESS")
        );
    }

    login = async (req, res) => {

        const {email, password} = req.body;

        const existEmail = await User.findOne({email});

        if (!existEmail) {
            throw new Error('Failed Login')
        }

        // Check From Strength Password
        try {
            passwordService.validatePasswordStrength(password);
        } catch (error) {
            return res.status(400).json(collection(false, error.message, null, "ERROR"));
        }

        // Password Verifying
        const verified = await passwordService.verifyPassword(
            password,
            existEmail.password
        );

        if (!verified) {
            return res.status(404).json(collection(false, 'Failed Login', null, "ERROR"));
        }

        // Generate tokens
        const accessToken = tokenService.generateAccessToken({
            id: existEmail._id,
            email: existEmail.email,
            role: existEmail.role
        });

        const refreshToken = tokenService.generateRefreshToken({
            id: existEmail._id,
            email: existEmail.email,
            role: existEmail.role,
        });

        RefreshToken.create({
            user_id: existEmail._id,
            token_hash: await passwordService.hashPassword(refreshToken)
        })

        return res.status(200).json(
            collection(true, 'Logged in Successfully', {user: existEmail, accessToken, refreshToken}, "SUCCESS")
        );
    }

    async refreshToken(req, res) {

        const {refreshToken} = req.body;
        if (!refreshToken) {
            return res.status(401).json(collection(false, 'Refresh Token Required', null, "ERROR"));
        }

        const payload = tokenService.verifyRefreshToken(refreshToken);

        const storedTokens = await RefreshToken.find({
            user_id: payload.id, revoked: false
        });


        let matchedToken = null;

        for (const token of storedTokens) {
            const match = await passwordService.verifyPassword(refreshToken, token.token_hash);
            if (match) {
                // res.json({msg:"true"})
                matchedToken = token;
                break;
            }
        }
        // res.json({matchedToken});
        if (!matchedToken) return res.status(403).json(collection(false, 'Invalid Refresh Token', null, "ERROR"));

        // revoke old token
        matchedToken.revoked = true;
        await matchedToken.save();

        const tokenPayload = {
            id: payload.id,
            email: payload.email,
            role: payload.role,
        };
        // generate tokens (access, refresh)
        const accessToken = tokenService.generateAccessToken(tokenPayload);
        const newRefreshToken = tokenService.generateRefreshToken(tokenPayload);


        await RefreshToken.create({
            user_id: payload.id,
            token_hash: await passwordService.hashPassword(newRefreshToken)
        })

        // res.json({msg: "hello"});
        return res.status(200).json(
            collection(true, 'Tokens Refreshed Successfully', {accessToken, refreshToken: newRefreshToken}, "SUCCESS")
        );
    }

    async logout(req, res) {
        await RefreshToken.deleteMany(
            {user_id: req.user.id}
        );
        return res.status(200).json(
            collection(true, 'Logged Out Successfully', null, "SUCCESS")
        );
    }

    async getPorfile(req, res) {
        const id = req.user.id;
        let user = await User.findById(id)
            .populate("institute_id","institute_name")
            .populate("college_id","college_name")
            .populate("department_id","department_name");


        // If user is a researcher
        if (user.role === "researcher") {
            const researcher = await Researcher.findOne({user_id: id});
            user = {user, researcher}
        }
        return res.status(200).json(collection(true, 'Get Profile Data', user, "SUCCESS"));
    }

}

module.exports = new AuthController();
