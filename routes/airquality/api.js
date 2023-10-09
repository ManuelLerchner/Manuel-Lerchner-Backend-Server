const express = require("express");
const router = express.Router();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

router.get("/api", async (req, res) => {
  const from = req.query.from;
  const to = req.query.to;

  if (!from || !to) {
    res.status(400).json({
      error:
        "Missing query parameters. Please provide 'from' and 'to' query parameters.",
    });
    return;
  }

  const data = await client
    .db("air_quality")
    .collection("air_quality")
    .find({
      date: {
        $gte: from,
        $lt: to,
      },
    })
    .toArray();

  res.json(data);
});

module.exports = router;
