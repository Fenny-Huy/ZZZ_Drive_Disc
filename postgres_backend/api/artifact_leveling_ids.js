const express = require("express");
const cors = require("cors");
const { localDb, cloudDb } = require("../db.js");

const artifactLevelingIdsRouter = express.Router();
artifactLevelingIdsRouter.use(cors());
artifactLevelingIdsRouter.use(express.json());

artifactLevelingIdsRouter.get("/", async (req, res) => {
  try {
    const query = `SELECT "ID" FROM "Drive_Disc_leveling"`;
    const rows = await localDb.unsafe(query);

    const ids = rows.map(row => row.ID);
    res.status(200).json(ids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = artifactLevelingIdsRouter;