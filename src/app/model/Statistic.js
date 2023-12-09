const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const Statistic = new Schema(
    {
        waterMeterId: {
            type: String,
            unique: false
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
            type: String,
            unique: false
        },
        image: {        // Ảnh chụp đồng hồ khi ghi nhận
            type: String
        }
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model("Statistic", Statistic);
