const express = require("express");
const cors = require("cors");

const { localDb, cloudDb } = require("../db.js");

const setRouter = express.Router();
setRouter.use(cors());

// Endpoint to get artifact sets with their counts
setRouter.get("/set", async (req, res) => {
  try {
    const query = `
      SELECT "Set", COUNT(*) AS totalcount
      FROM "Artifact_itself"
      GROUP BY "Set"
      ORDER BY totalcount DESC;
    `;
    const rows = await localDb.unsafe(query);
    const artifactsWithSubs = rows.map(row => ({
      set: row.Set,
      count: parseInt(row.totalcount, 10), // Ensure count is an integer
    }));
    res.status(200).json(artifactsWithSubs);
  } catch (error) {
    console.error("Error fetching artifact sets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to get artifact sources with their counts
setRouter.get("/where", async (req, res) => {
  try {
    const query = `
      SELECT "Where_got_it", COUNT(*) AS totalcount
      FROM "Artifact_itself"
      GROUP BY "Where_got_it"
      ORDER BY totalcount DESC;
    `;
    const rows = await localDb.unsafe(query);
    const artifactsWithSubs = rows.map(row => ({
      where: row.Where_got_it,
      count: parseInt(row.totalcount, 10), // Ensure count is an integer
    }));
    res.status(200).json(artifactsWithSubs);
  } catch (error) {
    console.error("Error fetching artifact sources:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to get artifact scores with their counts
setRouter.get("/score", async (req, res) => {
  try {
    const query = `
      SELECT "Score", COUNT(*) AS totalcount
      FROM "Artifact_itself"
      GROUP BY "Score"
      ORDER BY totalcount DESC;
    `;
    const rows = await localDb.unsafe(query);
    const artifactsWithSubs = rows.map(row => ({
      score: row.Score,
      count: parseInt(row.totalcount, 10), // Ensure count is an integer
    }));
    res.status(200).json(artifactsWithSubs);
  } catch (error) {
    console.error("Error fetching artifact scores:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to get statistics for artifact sets and their sources
setRouter.get("/set_where", async (req, res) => {
  try {
    const query = `
      SELECT "Set", "Where_got_it", COUNT(*) AS totalcount
      FROM "Artifact_itself"
      GROUP BY "Set", "Where_got_it"
      ORDER BY totalcount DESC;
    `;
    const rows = await localDb.unsafe(query);
    const artifactsWithSubs = rows.map(row => ({
      set: row.Set,
      where: row.Where_got_it,
      count: parseInt(row.totalcount, 10), // Ensure count is an integer
    }));
    res.status(200).json(artifactsWithSubs);
  } catch (error) {
    console.error("Error fetching set and where statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = setRouter;