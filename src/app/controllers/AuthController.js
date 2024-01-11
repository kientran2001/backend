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
            const findUser = await User.findOne({ phoneNumber: req.body.phoneNumber })
            if (findUser) {
                return res.status(403).send(
                    `<h1 style="margin:40px; color:red">Người dùng đã tồn tại trong hệ thống!</h1>`
                )
            }

            // Create new user
            const newUser = new User({
                ...req.body,
                password: hashed
            })
            await newUser.save()
            // res.status(200).json(user)
            return res.redirect('/user')
        } catch (err) {
            return res.status(500).json(err);
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
                return res.status(403).send(
                    `<h1 style="margin:40px; color:red">Số điện thoại không chính xác!</h1>
                    <a href="/auth/login" style="font-size:28px;text-decoration:none!important;margin-left:100px">
                        Quay lại trang đăng nhập
                    </a>`)
            }

            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword) {
                return res.status(403).send(
                    `<h1 style="margin:40px; color:red">Mật khẩu không chính xác!</h1>
                    <a href="/auth/login" style="font-size:28px;text-decoration:none!important;margin-left:100px">
                        Quay lại trang đăng nhập
                    </a>`)
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
                        return res.redirect('/statistic/consumption')
                    })
                })
            } else {
                return res.render('login', {
                    isLoggedIn: false
                })
            }
        } catch (err) {
            return res.status(500).json(err)
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