const express = require("express");
const router = express.Router();
const updateData = require("./updateData");

const QUERY_WINDOW_s = 60;
const REFRESH_RATE_s = 10;

let cachedData = [];
let clearIntervallFunc = null;

async function startQueryWindow(req) {
    //cold start
    cachedData = await updateData(req);

    //start intervall
    clearIntervallFunc = setInterval(async () => {
        let newData = await updateData(req);
        console.log("Nomics - Data refreshed");

        //if data looks valid
        if (newData.length > 0) {
            cachedData = newData;
        }
    }, REFRESH_RATE_s * 1000);
}

async function stopQueryWindow() {
    clearInterval(clearIntervallFunc);
    clearIntervallFunc = null;
    console.log("Nomics - Query window stopped");
}

router.get("/*", async (req, res) => {
    //if no query window is active
    if (!clearIntervallFunc) {
        await startQueryWindow(req);

        //close query window after QUERY_WINDOW sec
        setTimeout(async () => {
            stopQueryWindow();
        }, QUERY_WINDOW_s * 1000);

        console.log("Nomics - Query window started");
    } else {
        console.log("Nomics - Using cached data");
    }

    res.json(cachedData);
});

module.exports = router;
