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
        index: {
            type: Number,
            required: true,
            default: 0
        },
        date: {
            type: Date,
            required: true,
            default: new Date
        }
    },
    {
        timestamps: false,
    }
);

// Add plugins
// mongoose.plugin(slug);
// Statistic.plugin(mongooseDelete, {
//     deletedAt: true,
//     overrideMethods: "all",
// });

module.exports = mongoose.model("Statistic", Statistic);
