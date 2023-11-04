const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const Statistic = new Schema(
    {
        waterMeterId: {
            type: Schema.Types.ObjectId,
            ref: "WaterMeter"
        },
        lastIndex: {
            type: Number,
            required: true
        },
        lastDate: {
            type: Date,
            required: true
        },
        currentIndex: {
            type: Number,
            required: true
        },
        currentDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

// Add plugins
mongoose.plugin(slug);
Statistic.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all",
});

module.exports = mongoose.model("Statistic", Statistic);
