const express = require("express");
const cors = require("cors");
const { localDb, cloudDb } = require("../db.js");

const mainstatsetsRouter = express.Router();
mainstatsetsRouter.use(cors());

mainstatsetsRouter.get("/", async (req, res) => {
  try {
    const query = "SELECT \"Set\" FROM \"Artifact_itself\" GROUP BY \"Set\" ORDER BY \"Set\";";
    const rows = await localDb.unsafe(query);
    const sets = rows.map(row => row.Set);
    res.status(200).json(sets);
  } catch (error) {
    console.error("Error fetching main stat sets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = mainstatsetsRouter;