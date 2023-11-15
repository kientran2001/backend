const path = require("path");
const express = require("express");
const handlebars = require("express-handlebars");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const morgan = require("morgan");
const exp = require("constants");
const methodOverride = require("method-override");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const route = require("./routes");
const db = require("./config/db");

// Connect DB
db.connect();

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
}));
app.use(cookieParser())

app.use(express.static(path.join(__dirname, "public")));

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

app.use(cors());

app.use(
    bodyParser.urlencoded({
        extended: false,
    }),
);
app.use(bodyParser.json());

app.use(methodOverride("_method"));

// HTTP logger
// app.use(morgan("combined"));

// Template engine
app.engine(
    "hbs",
    handlebars.engine({
        extname: "hbs",
        helpers: {
            sum: (a, b) => a + b,
        },
    })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

// Routes init
route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
