const mongoose = require("mongoose");
const moment = require("moment");

const User = require("../model/User");
const Home = require("../model/Home");
const WaterMeter = require("../model/WaterMeter");
const Statistic = require("../model/Statistic");
const { mongooseToObject, multipleMongooseToObject } = require('../../utils/mongoose');


const StatisticController = {
    calculateConsumption: async (req, res, next) => {
        try {
            const result = await Statistic.aggregate([
                {
                    $sort: { waterMeterId: 1, date: -1 } // Sắp xếp theo waterMeterId tăng dần và theo date giảm dần
                },
                {
                    $group: {
                        _id: "$waterMeterId", // Nhóm theo waterMeterId
                        // latestStatistics: { $push: "$$ROOT" } 
                        latestStatistics: {
                            $push: {
                                value: "$value",
                                date: "$date" // Thêm date vào mảng
                            }
                        }
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
                        firstDate: { $first: "$latestStatistics.date" }, // Lấy ngày tương ứng với firstValue
                        secondDate: { $last: "$latestStatistics.date" }
                    }
                },
                {
                    $project: {
                        waterMeterId: "$_id",
                        firstValue: 1,
                        secondValue: 1,
                        firstDate: 1,
                        secondDate: 1,
                        consumption: { $subtract: ["$firstValue", "$secondValue"] }
                    }
                }
            ]);

            for (const record of result) {
                record.firstDate = record.firstDate.toLocaleDateString('en-GB')
                record.secondDate = record.secondDate.toLocaleDateString('en-GB')
                const waterMeterId = record.waterMeterId;
                const waterMeter = await WaterMeter.findById(waterMeterId)

                if (waterMeter) {
                    const home = await Home.findById(waterMeter.homeId)
                    const user = await User.findOne({ phoneNumber: home.phoneNumber})

                    // Thêm thông tin từ model Home vào kết quả
                    record.building = home.building;
                    record.code = home.code;
                    record.address = home.address;
                    record.phoneNumber = home.phoneNumber;
                    record.username = user.name
                }
            }

            // res.status(200).json(result);
            res.render('home-page', {
                isLoggedIn: true,
                admin: req.admin,
                results: multipleMongooseToObject(result)
            })
        } catch (e) {
            console.error(e);
            res.status(500).json(e)
        }
    },

    allRecords: async (req, res, next) => {
        try {
            const waterMeterId = req.params.waterMeterId
            const statistic = await Statistic.find({ waterMeterId: waterMeterId }).sort({ date: -1 })
            const waterMeter = await WaterMeter.findById(waterMeterId)
            const home = await Home.findById(waterMeter.homeId)
            const user = await User.findOne({ phoneNumber: home.phoneNumber })

            let statisticArr = []
            statistic.forEach(record => {
                record = {
                    waterMeterId: record.waterMeterId,
                    value: record.value,
                    date: moment(record.date).format('DD-MM-YYYY'),
                    recorderName: record.recorderName,
                    recorderPhone: record.recorderPhone
                }
                statisticArr.push(record)
            });

            const homeInfo = {
                username: user.name,
                userPhone: home.phoneNumber,
                building: home.building,
                code: home.code,
                address: home.address
            }


            res.render('statistic/show', {
                isLoggedIn: true,
                admin: req.admin,
                homeInfo: mongooseToObject(homeInfo),
                statistic: multipleMongooseToObject(statisticArr)
            })
        } catch (e) {
            res.status(500).json(e)
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
