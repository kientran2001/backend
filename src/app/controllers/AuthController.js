const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const AuthController = {
    registerUser: async (req, res, next) => {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(req.body.password, salt)

            // Create new user
            const newUser = new User({
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                password: hashed
            })

            const user = await newUser.save()
            res.status(200).json(user)
        } catch (err) {
            res.status(500).json(err);
        }
    },

    generateAccessToken: (user) => {
        return jwt.sign(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            process.env.JWT_ACESS_TOKEN,
            { expiresIn: "30d" }
        )
    },

    loginUser: async (req, res, next) => {
        try {
            const user = await User.findOne({ phoneNumber: req.body.phoneNumber })
            if (!user) {
                return res.status(404).json("Wrong username!")
            }

            const validPassword = bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword) {
                return res.status(404).json("Wrong password");
            }

            if (user && validPassword) {
                const accessToken = AuthController.generateAccessToken(user);
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict"
                });

                res.status(200).json({
                    accessToken,
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                })
            }
        } catch (err) {
            res.status(500).json(err)
        }
    },

    logOut: async (req, res, next) => {
        //Clear cookies when user logs out
        res.clearCookie("accessToken");
        res.status(200).json("Logged out successfully!");
    }
}

module.exports = AuthController