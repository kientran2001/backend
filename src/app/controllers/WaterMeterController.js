const User = require("../model/User");
const Home = require("../model/Home");
const WaterMeter = require("../model/WaterMeter");
const Statistic = require("../model/Statistic");


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
            const home = await Home.findById(waterMeter.homeId)
            if (!home) {
                return res.status(404).json("User not found")
            }

            home.waterMeterId = waterMeter._id
            await home.save()
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
            const homeId = waterMeter.homeId
            const home = await User.findById(homeId)
            if (home) {
                await Home.deleteOne({ _id: homeId })
            }

            // console.log('home', home)
            // const waterMeters = user.waterMeters.filter(p => p.toString() !== req.params.id.toString())
            // user.waterMeters = waterMeters
            // await user.save()
            // console.log('user updated:', user)
            
            await WaterMeter.deleteOne({ _id: req.params.id })
            res.status(200).json("Deleted successfully");
        } catch (e) {
            res.status(500).json(e)
        }
    },

    homeOfWaterMeter: async (req, res, next) => {
        try {
            const waterMeterId = req.params.id;

            // Kiểm tra xem WaterMeter có tồn tại không
            const waterMeter = await WaterMeter.findById(waterMeterId);
            if (!waterMeter) {
                return res.status(404).json({ error: 'WaterMeter not found' });
            }

            // Lấy thông tin User của WaterMeter
            const home = await Home.findById(waterMeter.homeId);
            if (!home) {
                return res.status(404).json({ error: "Home not found" });
            }
            res.status(200).json(home);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = WaterMeterController
