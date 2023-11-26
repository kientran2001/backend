const User = require("../model/User");
const Home = require("../model/Home");
const WaterMeter = require("../model/WaterMeter");
const Statistic = require("../model/Statistic");
const { mongooseToObject, multipleMongooseToObject } = require('../../utils/mongoose');
const mongoose = require("mongoose");


const HomeController = {
    showAll: async (req, res, next) => {
        try {
            const homes = await Home.find({}).sort({ address: 1 })
            // res.status(200).json(homes)
            res.render('home/show-all', {
                isLoggedIn: true,
                admin: req.admin,
                homes: multipleMongooseToObject(homes)
            })
        } catch (e) {
            res.status(500).json(e)
        }
    },

    homeDetails: async (req, res, next) => {
        try {
            const home = await Home.findById(req.params.id)
            // res.status(200).json(home)
            res.render('home/show', {
                isLoggedIn: true,
                admin: req.admin,
                home: mongooseToObject(home)
            })
        } catch (e) {
            res.status(500).json(e)
        }
    },

    add: (req, res, next) => {
        res.render('home/create', {
            isLoggedIn: true,
            admin: req.admin
        })
    },

    create: async (req, res, next) => {
        try {
            const home = new Home(req.body);
            const phoneNumber = home.phoneNumber
            const user = await User.findOne({ phoneNumber: phoneNumber })
            if (user) {
                user.homes.push(home._id)
                await user.save()
            } else {
                return res.status(404).send('User not found!')
            }
            home.waterMeterId = null

            await home.save()
            // res.status(200).json(home)
            res.redirect('/home')
        } catch (e) {
            res.status(500).json(e)
        }
    },

    edit: async (req, res, next) => {
        try {
            const home = await Home.findById(req.params.id)
            res.render('home/edit', {
                isLoggedIn: true,
                admin: req.admin,
                home: mongooseToObject(home)
            })
        } catch (e) {
            res.status(500).json(e)
        }
    },

    update: async (req, res, next) => {
        try {
            await Home.updateOne({ _id: req.params.id }, req.body);
            // res.status(200).json("Updated successfully!")
            res.redirect('/home')
        } catch (e) {
            res.status(500).json(e)
        }
    },

    delete: async (req, res, next) => {
        try {
            const home = await Home.findById(req.params.id)

            const phoneNumber = home.phoneNumber
            const user = await User.findOne({ phoneNumber: phoneNumber })
            if (user) {
                const homes = user.homes.filter(p => p.toString() !== req.params.id.toString())
                user.homes = homes
                await user.save()
            }

            const waterMeterId = home.waterMeterId
            if (waterMeterId) {
                const waterMeter = await WaterMeter.findById(waterMeterId)
                await WaterMeter.deleteOne(waterMeter)
            }
            await Home.deleteOne(home)
            // res.status(200).json("Deleted successfully!")
            res.redirect('back')
        } catch (e) {
            res.status(500).json(e)
        }
    },

    addPhoneNumber: async (req, res, next) => {
        try {
            const homeId = req.params.homeId
            const newPhoneNumber = req.params.newPhoneNumber

            const home = await Home.findById(homeId)
            home.phoneNumber = newPhoneNumber
            const user = await User.findOne({ phoneNumber: newPhoneNumber })
            if (user) {
                user.homes.push(home._id)
                await user.save()
            } else {
                return res.status(404).send({ message: 'User not found' })
            }

            await home.save()
            res.redirect('back')
        } catch (e) {
            res.status(500).json(e)
        }
    },

    deletePhoneNumber: async (req, res, next) => {
        try {
            const homeId = req.params.homeId
            const home = await Home.findById(homeId)

            const phoneNumber = home.phoneNumber
            const user = await User.findOne({ phoneNumber: phoneNumber })
            if (user) {
                const homes = user.homes.filter(p => p.toString() !== homeId.toString())
                user.homes = homes
                await user.save()
            }
            home.phoneNumber = null

            await home.save()
            res.redirect('/home/home-details/' + homeId)
        } catch (e) {
            res.status(500).json(e)
        }
    },

    userOfHome: async (req, res, next) => {
        try {
            const id = req.params.id;
            const home = await Home.findById(id);
            if (!home) {
                return res.status(404).json({ error: "Home not found" });
            }
            const phoneNumber = home.phoneNumber
            const user = await User.findOne({ phoneNumber: phoneNumber })
            res.status(200).json(user)
        } catch (e) {
            res.status(500).json(e)
        }
    },

    waterMeterOfHome: async (req, res, next) => {
        try {
            const id = req.params.id;
            const home = await Home.findById(id);
            if (!home) {
                return res.status(404).json({ error: "Home not found" });
            }

            const waterMeter = await WaterMeter.findById(home.waterMeterId)
            res.status(200).json(waterMeter)
        } catch (e) {
            res.status(500).json(e)
        }
    }
}

module.exports = HomeController
