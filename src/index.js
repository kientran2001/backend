const path = require("path");
const express = require("express");
const handlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var cors = require("cors");
const morgan = require("morgan");
const exp = require("constants");
const app = express();
const methodOverride = require("method-override");
require("dotenv").config();
const port = process.env.PORT || 5000;

const route = require("./routes");
const db = require("./config/db");

// Connect DB
db.connect();

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
app.use(morgan("combined"));

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
