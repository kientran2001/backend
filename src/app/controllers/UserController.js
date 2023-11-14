const User = require("../model/User");
const Home = require("../model/Home");
const WaterMeter = require("../model/WaterMeter");
const Statistic = require("../model/Statistic");
const bcrypt = require('bcrypt')
const { multipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose')

const UserController = {
    showAll: async (req, res, next) => {
        try {
            const users = await User.find({})
                .sort({ role: -1, name: 1 })
            // res.status(200).json(users)
            res.render('user/show-all', {
                users: multipleMongooseToObject(users)
            })
        } catch (e) {
            res.status(500).json(e)
        }
    },

    show: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id)
            res.render('user/show', {
                user: mongooseToObject(user)
            })
        } catch (e) {
            res.status(500).json(e)
        }
    },

    add: (req, res, next) => {
        res.render('user/register')
    },

    edit: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id)
            res.render('user/edit', {
                user: mongooseToObject(user)
            })
        } catch (e) {
            res.status(500).json(e)
        }
    },

    update: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id)
            let password = user.password
            // Đã đổi mật khẩu vì mật khẩu cũ sau khi mã hoá có độ dài > 20
            // mật khẩu chưa mã hoá có độ dài từ 6 đến 20 ký tự
            if (password.length < 20) {
                const salt = await bcrypt.genSalt(10)
                const hashed = await bcrypt.hash(password, salt)
                await User.updateOne({ _id: req.params.id }, { ...req.body, password: hashed })
            } else {
                await User.updateOne({ _id: req.params.id }, req.body)
            }
            res.redirect('/user')
        } catch (e) {
            res.status(500).json(e)
        }
    },

    delete: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id)
            const homes = user.homes

            homes.forEach(async homeId => {
                const home = await Home.findById(homeId)
                if (home) {
                    home.phoneNumber = null
                    await home.save()
                }
            })

            await User.deleteOne(user)
            // res.status(200).json("Deleted successfully!")
            res.redirect('back')
        } catch (e) {
            res.status(500).json(e)
        }
    },

    homesOfUser: async (req, res, next) => {
        try {
            const id = req.params.id;
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const homes = await Home.find({ _id: { $in: user.homes } })
            res.status(200).json(homes);
        } catch (e) {
            res.status(500).json(e)
        }
    }
}

module.exports = UserController
