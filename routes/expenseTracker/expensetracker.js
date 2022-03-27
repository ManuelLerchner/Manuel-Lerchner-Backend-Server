const express = require("express");
const router = express.Router();

const pool = require("./mariaDB");

router.get("/get", async (req, res) => {
    let email = "root@root.com";
    let password = "rootpw";

    try {
        let conn = await pool.getConnection();
        let [rows] = await conn.query(
            "SELECT * FROM users WHERE email = ? AND password = ?",
            [email, password]
        );

        res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

router.use("/auth", require("./auth"));

module.exports = router;
