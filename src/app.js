require("dotenv").config();

const express = require("express");
const app = express();
// HTTP request logger middleware
const morgan = require("morgan");

const mongoose = require("mongoose");

app.use(express.json());


/** start routes **/
app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/researcher", require("./routes/researcher.routes"));

/** end routes **/

// Error Middleware
app.use(require("./middlewares/error.middleware"));

// Not Found
app.use(require("./middlewares/notfound.middleware"));


const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

mongoose
    .connect(MONGO_URL)
    .then((res) => {
        console.log("Connected to database done");
        const server = app.listen(PORT, () => {
            console.log(`Server is running on: http://localhost:${PORT}`);
        });

    })
    .catch((err) => {
        console.log("Error:", err.message);
    });
