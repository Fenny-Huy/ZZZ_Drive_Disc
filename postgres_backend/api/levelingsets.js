const express = require("express");
const cors = require("cors");
const { localDb, cloudDb } = require("../db.js");

const levelingsetsRouter = express.Router();
levelingsetsRouter.use(cors());

levelingsetsRouter.get("/", async (req, res) => {
  try {
    const query = `
      SELECT \"Set\" 
      FROM \"Artifact_leveling\" l 
      JOIN \"Artifact_itself\" i ON l.\"ID\" = i.\"ID\" 
      GROUP BY \"Set\" 
      ORDER BY \"Set\";
    `;
    const rows = await localDb.unsafe(query);
    const sets = rows.map(row => row.Set);
    res.status(200).json(sets);
  } catch (error) {
    console.error("Error fetching leveling sets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = levelingsetsRouter;