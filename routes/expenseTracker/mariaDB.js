const mariadb = require("mariadb");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "./dotenv/.env") });

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 15,
});

pool.getConnection()
    .then((conn) => {
        console.log("Connected to mariaDB");
        conn.release();
    })
    .catch((err) => {
        console.log("Connection error:\n" + err);
    });

module.exports = pool;
