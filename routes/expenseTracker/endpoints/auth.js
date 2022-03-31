const express = require("express");
const router = express.Router();

var crypto = require("crypto");

const {
    checkIfAuthenticatedWithPassword,
    checkIfAuthenticatedWithToken,
    performDatabaseAction,
} = require("../helper");

router.post("/login", (req, res) => {
    performDatabaseAction(res, async (conn) => {
        let email = req.body.email;
        let password = req.body.password;

        //Authentication
        let user = await checkIfAuthenticatedWithPassword(
            email,
            password,
            conn,
            res
        );

        if (!user) {
            return;
        }

        //Generate auth token
        let authToken = crypto.randomBytes(64).toString("hex");

        //Update auth token
        await conn.query("UPDATE users SET authToken = ? WHERE email = ?", [
            authToken,
            email,
        ]);

        //Send response
        res.json({
            username: user.username,
            email: user.email,
            authToken: authToken,
        });

        console.log(`User ${user.username} logged in`);
    });
});

router.post("/register", (req, res) => {
    performDatabaseAction(res, async (conn) => {
        try {
            let email = req.body.email;
            let password = req.body.password;
            let username = req.body.username;

            //Create salt and hash
            let salt = crypto.randomBytes(16).toString("hex");
            let passwordHash = crypto
                .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
                .toString(`hex`);

            //Insert into database
            await conn.query(
                "INSERT INTO users (email, username, passwordHash, passwordSalt) VALUES (?, ?, ?, ?)",
                [email, username, passwordHash, salt]
            );

            //Send response
            res.json({
                username: username,
                email: email,
            });

            console.log(`User ${username} registered`);

        } catch (err) {
            //handle duplicate email error
            if (err.code === "ER_DUP_ENTRY") {
                res.status(409).send("User with this email already exists.");
                return;
            }

            throw err;
        }
    });
});

router.post("/keep-signed-in", (req, res) => {
    performDatabaseAction(res, async (conn) => {
        let userToLogin = req.body.user;

        //Authentication
        let user = await checkIfAuthenticatedWithToken(
            userToLogin.email,
            userToLogin.authToken,
            conn,
            res
        );

        if (!user) {
            return;
        }

        //Send response
        res.json({
            username: user.username,
            email: user.email,
            authToken: user.authToken,
        });

        console.log(`User ${user.username} signed in`);
    });
});

module.exports = router;
