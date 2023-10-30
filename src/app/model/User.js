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
        password: {
            type: String
        },
        email: {
            type: String,
            maxLength: 255,
        },
        role: {
            type: Number,
            enum: [1, 2, 3],    // 1.Người dùng, 2.Staff, 3.Admin
            default: 1
        },
        waterMeters: [
            {
                type: Schema.Types.ObjectId,
                ref: "WaterMeter",
            },
        ]
        // waterMeters: {
        //     type: String
        // }
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
