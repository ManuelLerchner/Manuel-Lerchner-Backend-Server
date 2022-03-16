const express = require("express");
const router = express.Router();
const https = require("https");

router.get("/*", (req, res) => {
  try {
    let requestedPath = req.path;

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
  } catch (err) {
    console.log(err);
    res.end();
  }
});

module.exports = router;
