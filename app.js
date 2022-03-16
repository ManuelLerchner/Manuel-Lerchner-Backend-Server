const express = require("express");

const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

dotenv.config({ path: path.resolve(__dirname, "./dotenv/.env") });

app.use(cors());
app.use(express.static("public"));
app.use("/nomics", require("./routes/nomics"));

app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
