const User = require("../model/User");
const Home = require("../model/Home");
const WaterMeter = require("../model/WaterMeter");
const Statistic = require("../model/Statistic");
const { mongooseToObject, multipleMongooseToObject } = require('../../utils/mongoose');
const mongoose = require("mongoose");


const HomeController = {
    showAll: async (req, res, next) => {
        try {
            const homes = await Home.find({})
            // res.status(200).json(homes)
            res.render('home/show-all', {
                homes: multipleMongooseToObject(homes),

            })
        } catch (e) {
            res.status(500).json({ e: "Internal Server Error" })
        }
    },

    homeDetails: async (req, res, next) => {
        try {
            const home = await Home.find({ _id: req.params.id })
            res.status(200).json(home)
        } catch (e) {
            res.status(500).json({ e: "Internal Server Error" })
        }
    },

    add: (req, res, next) => {
        res.render('home/create')
    },

    create: async (req, res, next) => {
        try {
            const home = new Home(req.body);
            const phoneNumber = home.phoneNumber
            const user = await User.findOne({ phoneNumber: phoneNumber })
            if (user) {
                user.homes.push(home._id)
                await user.save()
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
                home: mongooseToObject(home)
            })
        } catch (e) {
            res.status(500).json({ e: "Internal Server Error" })
        }
    },

    update: async (req, res, next) => {
        try {
            await Home.updateOne({ _id: req.params.id }, req.body);
            // res.status(200).json("Updated successfully!")
            res.redirect('/home')
        } catch (e) {
            res.status(500).json({ e: "Internal Server Error" })
        }
    },

    delete: async (req, res, next) => {
        try {
            const home = await Home.findById(req.params.id)
            // const users = home.users
            // users.forEach(async home => {
            //     await Home.deleteOne({ _id: home })
            // })
            const phoneNumber = home.phoneNumber
            const user = await User.findOne({ phoneNumber: phoneNumber })
            if (user) {
                const homes = user.homes.filter(p => p.toString() !== req.params.id.toString())
                user.homes = homes
                await user.save()
            }

            const waterMeterId = home.waterMeterId
            if (waterMeterId) {
                await WaterMeter.deleteOne(waterMeterId)
            }
            await Home.deleteOne({ _id: req.params.id })
            // res.status(200).json("Deleted successfully!")
            res.redirect('back')
        } catch (e) {
            res.status(500).json({ e: "Internal Server Error" })
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
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
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
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = HomeController
