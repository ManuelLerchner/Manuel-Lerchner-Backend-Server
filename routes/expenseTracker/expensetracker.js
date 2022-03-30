const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json());

router.use("/auth", require("./endpoints/auth"));
router.use("/expenses", require("./endpoints/expenses"));

module.exports = router;
