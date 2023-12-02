const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const WaterMeter = new Schema(
    {
        code: {
            type: String,
            maxLength: 100
        },
        homeId: {
            type: Schema.Types.ObjectId,
            ref: 'Home'
        },
        dateInstallation: {
            type: Date,
            default: new Date
        },
        qr: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

WaterMeter.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all",
});

module.exports = mongoose.model("WaterMeter", WaterMeter);
