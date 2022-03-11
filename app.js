const express = require("express");
const app = express();

const path = require("path");
const dotenv = require("dotenv");
const axios = require("axios");
var request = require("request");
const https = require("https");

dotenv.config({ path: path.resolve(__dirname, "./dotenv/.env") });

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/api/*", (req, res) => {
    let requestedPath = req.path.substring("/api".length);

    let url = `https://api.nomics.com/v1${requestedPath}`;

    url += `?key=${process.env.NOMICS_API_KEY}`;

    Object.keys(req.query).forEach(
        (key) => (url += `&${key}=${req.query[key]}`)
    );

    https.get(url, (response) => {
        response
            .on("data", (chunk) => {
                res.write(chunk);
            })
            .on("error", (error) => {
                console.log(error);
                res.send("error");
            })
            .on("end", () => {
                res.end();
            });
    });
});

app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`)
);
