const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

const setupSocketIO = require("./routes/monopoly/monopoly");

dotenv.config({ path: path.resolve(__dirname, "./dotenv/.env") });

const app = express();

app.use(cors());
app.use(express.static("public"));

app.use("/mocktrading", require("./routes/mocktrading/api"));
app.use("/expensetracker", require("./routes/expenseTracker/expensetracker"));

const server = app.listen(process.env.PORT, () =>
    console.log(`Server listening on port ${process.env.PORT}`)
);

setupSocketIO(server);
