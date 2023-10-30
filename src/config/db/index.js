const mongoose = require("mongoose");

// mongoose.set("strictQuery", false);
// const uri = `mongodb+srv://username:2XTMhxj48vDRBlLY@cluster0.ostfbz7.mongodb.net/backend`
const uri = `mongodb+srv://username:${process.env.DB_PASS}@cluster0.ostfbz7.mongodb.net/backend`

async function connect() {
    await mongoose
        .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

        .then(() => {
            console.log("Connect database successfully!");
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = { connect };
