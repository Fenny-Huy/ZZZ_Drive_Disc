const express = require("express");
const cors = require("cors");
const { localDb, cloudDb } = require("../db.js");

const artifactRouter = express.Router();
artifactRouter.use(cors());
artifactRouter.use(express.json());

artifactRouter.get("/:artifact_id", async (req, res) => {
  try {
    const { artifact_id } = req.params;

    const query = `SELECT * FROM "Artifact_itself" WHERE "ID" = $1`;
    const rows = await localDb.unsafe(query, [artifact_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Artifact not found" });
    }

    const row = rows[0];
    const artifact = {
      id: row.ID,
      set: row.Set,
      type: row.Type,
      main_stat: row.Main_Stat,
      number_of_substats: row.Number_of_substat,
      atk_percent: row.Percent_ATK,
      hp_percent: row.Percent_HP,
      def_percent: row.Percent_DEF,
      atk: row.ATK,
      hp: row.HP,
      defense: row.DEF,
      er: row.ER,
      em: row.EM,
      crit_rate: row.Crit_Rate,
      crit_dmg: row.Crit_DMG,
      where_got_it: row.Where_got_it,
      score: row.Score,
    };

    res.status(200).json(artifact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = artifactRouter;