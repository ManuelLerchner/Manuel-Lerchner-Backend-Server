const pool = require("./mariaDB");
var crypto = require("crypto");

const checkIfAuthenticatedWithToken = async function (
    email,
    authToken,
    conn,
    res
) {
    let [queryResponse] = await conn.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (queryResponse === undefined) {
        res.status(401).send("No user with this email registered.");
        return null;
    }

    if (authToken !== queryResponse.authToken) {
        res.status(401).send("Invalid auth token.");
        return null;
    }

    return queryResponse;
};

const checkIfAuthenticatedWithPassword = async function (
    email,
    password,
    conn,
    res
) {
    let [queryResponse] = await conn.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (queryResponse === undefined) {
        res.status(401).send("No user with this email registered.");
        return null;
    }

    let passwordSalt = queryResponse.passwordSalt;
    var passwordHash = crypto
        .pbkdf2Sync(password, passwordSalt, 1000, 64, `sha512`)
        .toString(`hex`);

    if (passwordHash !== queryResponse.passwordHash) {
        res.status(401).send("Incorrect email or password.");
        return null;
    }

    return queryResponse;
};

const performDatabaseAction = async function (res, func) {
    let conn = await pool.getConnection();

    try {
        await func(conn);
    } catch (err) {
        console.log(err);
        res.status(500).send("MariaDB Error: " + err.coden);
    } finally {
        conn.release();
    }
};

module.exports = {
    checkIfAuthenticatedWithToken,
    checkIfAuthenticatedWithPassword,
    performDatabaseAction,
};
