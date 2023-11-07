const User = require("../model/User");
const Home = require("../model/Home");
const WaterMeter = require("../model/WaterMeter");
const Statistic = require("../model/Statistic");


const StatisticController = {
    recentStatistic: async (waterMeterId) => {
        try {
            const waterMeter = await WaterMeter.findById(waterMeterId);
            if (!waterMeter) {
                return res.status(404).json({ error: 'WaterMeter not found' });
            }

            const recentStatistic = await Statistic
                .find({ waterMeterId: waterMeterId })
                .sort({ currentDate: -1 })
                .limit(1)

            return recentStatistic
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    create: async (req, res, next) => {
        try {
            const statistic = new Statistic(req.body)
            const waterMeterId = req.body.waterMeterId
            const waterMeter = await WaterMeter.findById(waterMeterId)
            if (!waterMeter) {
                return res.status(404).json("WaterMeter not found")
            }

            await statistic.save()
            res.status(200).json(statistic)
        } catch (e) {
            res.status(500).json(e)
        }
    },

    statisticOfHome: async (req, res, next) => {
        try {
            const homeId = req.params.homeId;
            const home = await Home.findById(homeId);
            if (!home) {
                return res.status(404).json({ error: 'Home not found' });
            }

            const waterMeterId = home.waterMeterId;
            const waterMeter = await WaterMeter.findById(waterMeterId);
            if (!waterMeter) {
                return res.status(404).json({ error: 'WaterMeter not found' });
            }

            const statistics = await Statistic
                .find({ waterMeterId: waterMeterId })
                .sort({ currentDate: -1 })

            res.status(200).json(statistics)
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = StatisticController
