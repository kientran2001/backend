const mongoose = require("mongoose");

const User = require("../model/User");
const Home = require("../model/Home");
const WaterMeter = require("../model/WaterMeter");
const Statistic = require("../model/Statistic");


const StatisticController = {
    allLastStatistics: async (req, res, next) => {
        try {
            const latestStatistics = await Statistic.aggregate([
                {
                    $sort: { date: -1 } // Sắp xếp theo ngày giảm dần
                },
                {
                    $group: {
                        _id: "$waterMeterId", // Nhóm theo waterMeterId
                        latestStatistic: { $first: "$$ROOT" } // Lấy bản ghi đầu tiên của mỗi nhóm (bản ghi gần nhất)
                    }
                },
                {
                    $replaceRoot: { newRoot: "$latestStatistic" } // Làm mới cấu trúc để lấy các trường của bản ghi gần nhất
                }
            ]);
            res.status(200).json(latestStatistics)
        } catch (e) {
            res.status(200).json(e)
        }

        res.status(200).json(latestStatistics)
    },

    twoLastStatistic: async (req, res, next) => {
        try {
            const twoLatestStatistics = await Statistic.aggregate([
                {
                    $sort: { waterMeterId: 1, date: -1 } // Sắp xếp theo waterMeterId tăng dần và theo ngày giảm dần
                },
                {
                    $group: {
                        _id: "$waterMeterId", // Nhóm theo waterMeterId
                        latestStatistics: { $push: "$$ROOT" } // Đưa tất cả các bản ghi vào một mảng
                    }
                },
                {
                    $project: {
                        latestStatistics: { $slice: ["$latestStatistics", 2] } // Chọn 2 bản ghi đầu tiên của mảng
                    }
                },
                {
                    $unwind: "$latestStatistics" // Mở rộng mảng thành các bản ghi riêng lẻ
                }
            ]);
            res.status(200).json(twoLatestStatistics)
        } catch (e) {
            res.status(500).json(e)
        }
    },

    calculateConsumption: async (req, res, next) => {
        try {
            const result = await Statistic.aggregate([
                {
                    $sort: { waterMeterId: 1, date: -1 } // Sắp xếp theo waterMeterId tăng dần và theo date giảm dần
                },
                {
                    $group: {
                        _id: "$waterMeterId", // Nhóm theo waterMeterId
                        latestStatistics: { $push: "$$ROOT" } // Đưa tất cả các bản ghi vào một mảng
                    }
                },
                {
                    $project: {
                        latestStatistics: { $slice: ["$latestStatistics", 2] } // Chọn 2 bản ghi đầu tiên của mảng
                    }
                },
                {
                    $unwind: "$latestStatistics" // Mở rộng mảng thành các bản ghi riêng lẻ
                },
                {
                    $group: {
                        _id: "$_id",
                        firstValue: { $first: "$latestStatistics.value" }, // Giá trị của bản ghi gần nhất
                        secondValue: { $last: "$latestStatistics.value" }, // Giá trị của bản ghi thứ hai gần nhất
                        latestDate: { $first: "$latestStatistics.date" } // Ngày của bản ghi gần nhất
                    }
                },
                {
                    $project: {
                        waterMeterId: "$_id",
                        firstValue: 1,
                        secondValue: 1,
                        consumption: { $subtract: ["$firstValue", "$secondValue"] }, // Tính hiệu số
                        latestDate: 1
                    }
                }
            ]);

            res.status(200).json(result)
        } catch (e) {
            console.error(e);
            res.status(500).json(e)
        }
    },

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
