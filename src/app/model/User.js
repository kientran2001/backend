const mongoose = require("mongoose");
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
            type: String,
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
        },
        homes: [
            {
                type: Schema.Types.ObjectId,
                ref: "Home",
            },
        ]
    },
    {
        timestamps: true,
    }
);

User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all",
});

module.exports = mongoose.model("User", User);
