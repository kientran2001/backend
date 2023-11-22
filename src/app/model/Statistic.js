const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const Statistic = new Schema(
    {
        waterMeterId: {
            type: String,
            unique: false
            // ref: "WaterMeter"
        },
        value: {
            type: Number,
            required: true,
            default: 0
        },
        date: {
            type: Date,
            required: true,
            default: new Date
        },
        recorderName: {
            type: String,
            unique: false
        },
        recorderPhone: {
            type: Number,
            unique: false
        }
    },
    {
        timestamps: false,
    }
);


module.exports = mongoose.model("Statistic", Statistic);
