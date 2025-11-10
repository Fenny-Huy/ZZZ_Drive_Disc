const express = require("express");
const cors = require("cors");

const { localDb, cloudDb } = require("../db.js");

const scoreRouter = express.Router();
scoreRouter.use(cors());

// Endpoint to get artifact scores with their counts
scoreRouter.get("/", async (req, res) => {
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
      count: parseInt(row.totalcount, 10),
    }));
    res.status(200).json(artifactsWithSubs);
  } catch (error) {
    console.error("Error fetching artifact scores:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to get artifact scores grouped by set
scoreRouter.get("/set", async (req, res) => {
  try {
    const query = `
      SELECT "Score", "Set", COUNT(*) AS totalcount
      FROM "Artifact_itself"
      GROUP BY "Score", "Set"
      ORDER BY totalcount DESC;
    `;
    const rows = await localDb.unsafe(query);
    const artifactsWithSubs = rows.map(row => ({
      score: row.Score,
      set: row.Set,
      count: parseInt(row.totalcount, 10),
    }));
    res.status(200).json(artifactsWithSubs);
  } catch (error) {
    console.error("Error fetching artifact scores by set:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to get artifact scores grouped by source
scoreRouter.get("/where", async (req, res) => {
  try {
    const query = `
      SELECT "Score", "Where_got_it", COUNT(*) AS totalcount
      FROM "Artifact_itself"
      GROUP BY "Score", "Where_got_it"
      ORDER BY totalcount DESC;
    `;
    const rows = await localDb.unsafe(query);
    const artifactsWithSubs = rows.map(row => ({
      score: row.Score,
      where: row.Where_got_it,
      count: parseInt(row.totalcount, 10),
    }));
    res.status(200).json(artifactsWithSubs);
  } catch (error) {
    console.error("Error fetching artifact scores by source:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to get artifact scores grouped by set and source
scoreRouter.get("/set_where", async (req, res) => {
  try {
    const query = `
      SELECT "Score", "Set", "Where_got_it", COUNT(*) AS totalcount
      FROM "Artifact_itself"
      GROUP BY "Score", "Set", "Where_got_it"
      ORDER BY totalcount DESC;
    `;
    const rows = await localDb.unsafe(query);
    const artifactsWithSubs = rows.map(row => ({
      score: row.Score,
      set: row.Set,
      where: row.Where_got_it,
      count: parseInt(row.totalcount, 10),
    }));
    res.status(200).json(artifactsWithSubs);
  } catch (error) {
    console.error("Error fetching artifact scores by set and source:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = scoreRouter;