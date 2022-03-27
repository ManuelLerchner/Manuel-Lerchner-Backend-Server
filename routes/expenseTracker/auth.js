const express = require("express");
const router = express.Router();
var crypto = require("crypto");

const pool = require("./mariaDB");

router.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    let conn = await pool.getConnection();

    try {
        let [row] = await conn.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);

        if (row === undefined) {
            res.status(401).send("No user with this email registered");
            return;
        }

        let passwordSalt = row.passwordSalt;
        var passwordHash = crypto
            .pbkdf2Sync(password, passwordSalt, 1000, 64, `sha512`)
            .toString(`hex`);

        if (passwordHash !== row.passwordHash) {
            res.status(401).send("Invalid credentials");
            return;
        }

        res.json({
            id: row.id,
            username: row.username,
            email: row.email,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    } finally {
        conn.release();
    }
});

router.post("/register", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;

    let salt = crypto.randomBytes(16).toString("hex");
    let passwordHash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
        .toString(`hex`);

    let conn = await pool.getConnection();

    try {
        await conn.query(
            "INSERT INTO users (email, username, passwordHash, passwordSalt) VALUES (?, ?, ?, ?)",
            [email, username, passwordHash, salt]
        );

        res.json({
            username: username,
            email: email,
        });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            res.status(409).send("User already exists");
            return;
        }
        console.log(err);
        res.status(500).send("Error");
    } finally {
        conn.release();
    }
});

module.exports = router;
