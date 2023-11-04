const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const Home = new Schema(
    {
        building: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        waterMeterId: {
            type: Schema.Types.ObjectId,
            ref: "WaterMeter"
        }
    },
    {
        timestamps: true,
    }
);

// Add plugins
mongoose.plugin(slug);
Home.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all",
});

module.exports = mongoose.model("Home", Home);
