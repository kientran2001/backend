const bcrypt = require('bcrypt')
require("dotenv").config();
const mongoose = require('mongoose');

const User = require("../model/User");
const Home = require("../model/Home");
const WaterMeter = require("../model/WaterMeter");
const Statistic = require("../model/Statistic");

const AppController = {
    // API for android apps
    loginApp: async (req, res, next) => {
        try {
            const user = await User.findOne({ phoneNumber: req.body.phoneNumber })
            if (!user) {
                res.status(404).json("Wrong phone number!")
            }

            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword) {
                return res.status(404).json("Wrong password");
            }

            if (user.role === 2 && validPassword) {
                const staff = {
                    name: user.name,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                    role: user.role
                }

                res.status(200).json(staff)
            } else {
                res.status(404).json("User not found")
            }
        } catch (e) {
            // console.error(e)
            res.status(500).json(e)
        }
    },

    recentRecord: async (req, res, next) => {
        try {
            const waterMeterId = req.params.waterMeterId
            const statistic = await Statistic
                .find({ waterMeterId: waterMeterId })
                .sort({ date: -1 })
                .limit(1)
                .exec()

            if (!statistic || statistic.length === 0) {
                // console.log('Chưa có dữ liệu của đồng hồ này: ' + waterMeterId);
                return res.status(404).json('Chưa có dữ liệu của đồng hồ này')
            }

            res.status(200).json(statistic[0])
        } catch (e) {
            res.status(500).json(e)
        }
    },

    addRecord: async (req, res, next) => {
        try {
            // data { waterMeterId, name, phoneNumber, building, homeCode, address, lastValue, currentValue, dateRecord }
            const data = req.body
            const waterMeterId = req.body.waterMeterId
            const waterMeter = await WaterMeter.findById(waterMeterId)
            if (!waterMeter) {
                return res.status(404).json("WaterMeter not found")
            }

            const record = new Statistic({
                waterMeterId: waterMeterId,
                value: req.body.value,
                date: req.body.date || new Date(),
                recorderName: req.body.recorderName,
                recorderPhone: req.body.recorderPhone
            })

            await record.save()
            res.status(200).json('Ghi dữ liệu thành công!')
        } catch (e) {
            res.status(500).json(e)
        }
    }
}

module.exports = AppController
