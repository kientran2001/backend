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
            required: true,
            unique: true
        },
        password: {
            type: String,
            minLength: 6
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
        homes: [
            {
                type: Schema.Types.ObjectId,
                ref: "Home",
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
