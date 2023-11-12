const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const WaterMeter = new Schema(
    {
        code: {
            type: String,
            maxLength: 100,
            unique: true,
            required: true
        },
        homeId: {
            type: Schema.Types.ObjectId,
            ref: 'Home',
            unique: true
        },
        dateInstallation: {
            type: Date,
            required: true,
            default: new Date
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
