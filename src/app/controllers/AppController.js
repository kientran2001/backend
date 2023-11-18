const User = require('../model/User')
const bcrypt = require('bcrypt')
require("dotenv").config();


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
    }
}

module.exports = AppController
