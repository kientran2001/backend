const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const User = new Schema(
    {
        name: {
            type: String,
            maxLength: 255,
            required: true,
        },
        phoneNumber: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            maxLength: 255,
        },
        waterMeters: [
            {
                type: Schema.Types.ObjectId,
                ref: "WaterMeter",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Add plugins
mongoose.plugin(slug);
User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all",
});

module.exports = mongoose.model("User", User);
