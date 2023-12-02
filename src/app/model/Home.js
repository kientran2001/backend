const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const Home = new Schema(
    {
        building: {
            type: String,
            required: true
        },
        code: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            unique: false
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

Home.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all",
});

module.exports = mongoose.model("Home", Home);
