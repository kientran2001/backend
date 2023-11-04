const User = require("../model/User");
const WaterMeter = require("../model/WaterMeter");

const UserController = {
    async showAll(req, res, next) {
        try {
            const users = await User.find({})
            res.status(200).json(users)
        } catch (e) {
            res.status(500).json(e)
        }
    },

    async show(req, res, next) {
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

    update: async (req, res, next) => {
        await User.updateOne({ _id: req.params.id }, req.body)
            .then(res.status(200).json("Updated successfully!"))
            .catch(next);
    },

    delete: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id)
            const waterMeters = user.waterMeters
            
            waterMeters.forEach(async waterMeter => {
                await WaterMeter.deleteOne({ _id: waterMeter })
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

    async waterMetersOfUser(req, res, next) {
        try {
            const id = req.params.id;
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Lấy toàn bộ WaterMeter của User
            const waterMeters = await WaterMeter.find({ userId: id });
            res.json(waterMeters);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = UserController
