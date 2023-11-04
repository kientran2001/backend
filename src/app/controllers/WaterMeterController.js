const WaterMeter = require("../model/WaterMeter");
const User = require("../model/User");


const WaterMeterController = {
    showAll: async (req, res, next) => {
        try {
            const waterMeters = await WaterMeter.find({})
            res.status(200).json(waterMeters)
        } catch (e) {
            res.status(500).json(e)
        }
    },

    show: async (req, res, next) => {
        try {
            const waterMeter = await WaterMeter.find({ _id: req.params.id })
            res.status(200).json(waterMeter)
        } catch (e) {
            res.status(500).json(e)
        }
    },

    create: async (req, res, next) => {
        try {
            const waterMeter = new WaterMeter(req.body);
            const user = await User.findById({ _id: req.body.userId })
            if (!user) {
                return res.status(404).json("User not found")
            }

            await user.waterMeters.push(waterMeter._id)
            await user.save()
            await waterMeter.save()
            res.status(200).json(waterMeter)
        } catch (e) {
            res.status(500).json(e)
        }
    },

    update: async (req, res, next) => {
        try {
            await WaterMeter.updateOne({ _id: req.params.id }, req.body)
            res.status(200).json("Updated successfully!")
        } catch (e) {
            res.status(500).json(e)
        }
    },

    delete: async (req, res, next) => {
        try {
            const waterMeter = await WaterMeter.findById(req.params.id)
            const userId = waterMeter.userId
            const user = await User.findById(userId)

            // console.log('user', user)
            const waterMeters = user.waterMeters.filter(p => p.toString() !== req.params.id.toString())
            user.waterMeters = waterMeters
            await user.save()

            // console.log('user updated:', user)

            await WaterMeter.deleteOne({ _id: req.params.id })
            res.status(200).json("Deleted successfully");
        } catch (e) {
            res.status(500).json(e)
        }
    },

    userOfWaterMeter: async (req, res, next) => {
        try {
            const waterMeterId = req.params.id;

            // Kiểm tra xem WaterMeter có tồn tại không
            const waterMeter = await WaterMeter.findById(waterMeterId);
            if (!waterMeter) {
                return res.status(404).json({ error: 'WaterMeter not found' });
            }

            // Lấy thông tin User của WaterMeter
            const user = await User.findById(waterMeter.userId);
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = WaterMeterController
