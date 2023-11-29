const QR = require('qrcode')
const moment = require('moment')

const User = require("../model/User");
const Home = require("../model/Home");
const WaterMeter = require("../model/WaterMeter");
const Statistic = require("../model/Statistic");
const { mongooseToObject, multipleMongooseToObject } = require('../../utils/mongoose');


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
            const waterMeter = await WaterMeter.findById(req.params.id)
            let data = {
                _id: waterMeter._id,
                code: waterMeter.code,
                homeId: waterMeter.homeId,
                dateInstallation: moment(waterMeter.dateInstallation).format('DD-MM-YYYY'),
                qr: waterMeter.qr
            }

            res.render('waterMeter/show', {
                isLoggedIn: true,
                admin: req.admin,
                waterMeter: mongooseToObject(data)
            })
        } catch (e) {
            res.status(500).json(e)
        }
    },

    add: async (req, res, next) => {
        try {
            const homeId = req.params.homeId
            const home = await Home.findById(homeId)
            if (home.waterMeterId != null) {
                return res.status(403).send(`<h1 style="margin:40px; color:red">Căn hộ này đã có đồng hồ</h1>`)
            } else {
                res.render('waterMeter/create', {
                    isLoggedIn: true,
                    admin: req.admin,
                    homeId: homeId
                })
            }
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
            const user = await User.findOne({ phoneNumber: home.phoneNumber })
            const data = {
                waterMeterId: waterMeter._id,
                name: user.name,
                phoneNumber: user.phoneNumber,
                building: home.building,
                homeCode: home.code,
                address: home.address
            }
            let dataJson = JSON.stringify(data)
            waterMeter.qr = await QR.toDataURL(dataJson)

            await home.save()
            await waterMeter.save()
            // res.status(200).json(waterMeter)
            res.redirect('/home/home-details/' + home._id)
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
            const home = await Home.findById(homeId)
            if (home) {
                home.waterMeterId = null
                await home.save()
            }

            await WaterMeter.deleteOne(waterMeter)
            // res.status(200).json("Deleted successfully");
            res.redirect('back')
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
