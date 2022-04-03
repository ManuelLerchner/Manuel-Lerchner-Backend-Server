const express = require("express");
const http = require("http");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

const setupSocketIO = require("./routes/monopoly/monopoly");

dotenv.config({ path: path.resolve(__dirname, "./dotenv/.env") });

const app = express();

app.use(cors());
app.use(express.static("public"));

app.use("/nomics", require("./routes/mocktrading/nomics"));
app.use("/expensetracker", require("./routes/expenseTracker/expensetracker"));

const server = http.createServer(app);

setupSocketIO(server);

server.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}`));
