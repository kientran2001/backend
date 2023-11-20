const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config();

const { multipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose')

const AuthController = {
    registerUser: async (req, res, next) => {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(req.body.password, salt)

            // Create new user
            const newUser = new User({
                // name: req.body.name,
                // phoneNumber: req.body.phoneNumber,
                // email: req.body.email,
                ...req.body,
                password: hashed
                // role: req.body.role
            })

            const user = await newUser.save()
            // res.status(200).json(user)
            res.redirect('/user')
        } catch (err) {
            res.status(500).json(err);
        }
    },

    generateAccessToken: (user) => {
        return jwt.sign(
            {
                _id: user._id,
                name: user.name,
                phoneNumber: user.phoneNumber,
                email: user.email,
                role: user.role
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "1d" }
        )
    },

    login: (req, res) => {
        return res.render('login', {
            isLoggedIn: false
        })
    },

    loginUser: async (req, res, next) => {
        try {
            const user = await User.findOne({ phoneNumber: req.body.phoneNumber })
            if (!user) {
                res.status(404).json("Wrong phone number!")
            }

            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword) {
                return res.status(404).json("Wrong password");
            }

            if (user.role === 3 && validPassword) {
                const accessToken = AuthController.generateAccessToken(user);
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict"
                });
                res.cookie('logged_in', true, { expiresIn: '1d' })
                req.session.regenerate(function (err) {
                    if (err) return res.status(404).json(err)
                    req.session.user = user
                    req.session.save(function (err) {
                        if (err) return res.status(404).json(err)
                        return res.redirect('/homePage')
                    })
                })
            } else {
                return res.render('login', {
                    isLoggedIn: false
                })
            }
        } catch (err) {
            res.status(500).json(err)
        }
    },

    logOut: async (req, res, next) => {
        //Clear cookies when user logs out
        res.clearCookie("accessToken");
        res.clearCookie("logged_in");
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.redirect('/')
        });
    }
}

module.exports = AuthController