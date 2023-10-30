const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const WaterMeter = new Schema(
    {
        code: {
            type: String,
            maxLength: 255,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        building: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        dateInstallation: {
            type: Date,
            required: true
        },
        lastIndex: {
            type: Number,
            required: true
        },
        currentIndex: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

// Add plugins
mongoose.plugin(slug);
WaterMeter.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all",
});

module.exports = mongoose.model("WaterMeter", WaterMeter);
