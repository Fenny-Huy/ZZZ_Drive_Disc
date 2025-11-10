const express = require("express");
const cors = require("cors");
const { localDb, cloudDb } = require("../db.js");

const artifactLevelingRouter = express.Router();
artifactLevelingRouter.use(cors());
artifactLevelingRouter.use(express.json());

artifactLevelingRouter.post("/", async (req, res) => {
  try {
    const {
      id,
      L_HP,
      L_ATK,
      L_DEF,
      L_HP_per,
      L_ATK_per,
      L_DEF_per,
      L_AP,
      L_PEN,
      L_CritRate,
      L_CritDMG,
      addedSubstat
    } = req.body;

    const queryCheck = `SELECT 1 FROM "Drive_Disc_leveling" WHERE "ID" = $1`;
    const exists = await localDb.unsafe(queryCheck, [id]);

    let query;
    if (exists.length > 0) {
      query = `
        UPDATE "Drive_Disc_leveling" SET
          "L_HP" = $1,
          "L_ATK" = $2,
          "L_DEF" = $3,
          "L_Percent_HP" = $4,
          "L_Percent_ATK" = $5,
          "L_Percent_DEF" = $6,
          "L_AP" = $7,
          "L_PEN" = $8,
          "L_Crit_Rate" = $9,
          "L_Crit_DMG" = $10,
          "Added_substat" = $11,
          "LastAdded" = CURRENT_DATE
        WHERE "ID" = $12
      `;
      for (const db of [localDb, cloudDb]) {

        await db.unsafe(query, [
          L_HP,
          L_ATK,
          L_DEF,
          L_HP_per,
          L_ATK_per,
          L_DEF_per,
          L_AP,
          L_PEN,
          L_CritRate,
          L_CritDMG,
          addedSubstat,
          id
        ]);

      }
    } else {
      query = `
        INSERT INTO "Drive_Disc_leveling" (
          "ID", "L_HP", "L_ATK", "L_DEF", "L_Percent_HP", "L_Percent_ATK", "L_Percent_DEF", "L_AP", "L_PEN", "L_Crit_Rate", "L_Crit_DMG", "Added_substat"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `;

      for (const db of [localDb, cloudDb]) {
        await db.unsafe(query, [
          id,
          L_HP,
          L_ATK,
          L_DEF,
          L_HP_per,
          L_ATK_per,
          L_DEF_per,
          L_AP,
          L_PEN,
          L_CritRate,
          L_CritDMG,
          addedSubstat
        ]);
      }

      
    }

    res.status(200).json({ message: "Drive Disc leveling record added/updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

artifactLevelingRouter.get("/:artifact_id", async (req, res) => {
  try {
    const { artifact_id } = req.params;

    const query = `SELECT * FROM "Drive_Disc_leveling" WHERE "ID" = $1`;
    const rows = await localDb.unsafe(query, [artifact_id]);

    if (rows.length === 0) {
      return res.status(200).json(null); // Return null when not found
    }

    const row = rows[0];
    const artifactLeveling = {
      id: row.ID,
      L_HP: row.L_HP,
      L_ATK: row.L_ATK,
      L_DEF: row.L_DEF,
      L_HP_per: row.L_Percent_HP,
      L_ATK_per: row.L_Percent_ATK,
      L_DEF_per: row.L_Percent_DEF,
      L_AP: row.L_AP,
      L_PEN: row.L_PEN,
      L_CritRate: row.L_Crit_Rate,
      L_CritDMG: row.L_Crit_DMG,
      addedSubstat: row.Added_substat
    };

    res.status(200).json(artifactLeveling);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = artifactLevelingRouter;