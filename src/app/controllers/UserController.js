const User = require("../model/User");
const Home = require("../model/Home");
const WaterMeter = require("../model/WaterMeter");
const Statistic = require("../model/Statistic");
const { multipleMongooseToObject } = require('../../utils/mongoose')

const UserController = {
    showAll: async(req, res, next) => {
        try {
            const users = await User.find({})
            // res.status(200).json(users)
            res.render('user/show-all', {
                users: multipleMongooseToObject(users)
            })
        } catch (e) {
            res.status(500).json(e)
        }
    },

    show: async(req, res, next) => {
        try {
            const user = await User.find({ _id: req.params.id })
            res.status(200).json(user)
        } catch (e) {
            res.status(500).json(e)
        }
        // User.find({ _id: req.params.id })
        //     .then((user) => res.json(user))
        //     .catch(next);
    },

    add: (req, res, next) => {
        res.render('user/register')
    },

    update: async (req, res, next) => {
        try {
            await User.updateOne({ _id: req.params.id }, req.body)
            res.status(200).json("Updated successfully!")
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
                home.userId = null
                await home.save()
            })

            await User.deleteOne({ _id: req.params.id })
            res.status(200).json("Deleted successfully!")
        } catch (e) {
            res.status(500).json(e)
        }

        // User.deleteOne({ _id: req.params.id })
        //     .then((users) => {
        //         res.status(200).json("Deleted successfully");
        //     })
        //     .catch(next);
    },

    homesOfUser: async(req, res, next) => {
        try {
            const id = req.params.id;
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const homes = await WaterMeter.find({ userId: id });
            res.status(200).json(homes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = UserController
