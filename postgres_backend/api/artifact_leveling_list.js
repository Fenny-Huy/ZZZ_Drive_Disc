const express = require("express");
const cors = require("cors");
const { localDb, cloudDb } = require("../db.js");

const artifactLevelingListRouter = express.Router();
artifactLevelingListRouter.use(cors());
artifactLevelingListRouter.use(express.json());

artifactLevelingListRouter.get("/", async (req, res) => {
  try {
    const query = `
      SELECT al."ID", al."L_HP", al."L_ATK", al."L_DEF", al."L_Percent_HP", al."L_Percent_ATK", al."L_Percent_DEF", al."L_AP", al."L_PEN", al."L_Crit_Rate", al."L_Crit_DMG", al."Added_substat",
             ai."Set", ai."Slot", ai."Main_Stat", ai."Number_of_substat", ai."Percent_ATK", ai."Percent_HP", ai."Percent_DEF", ai."ATK", ai."HP", ai."DEF", ai."PEN", ai."AP", ai."Crit_Rate", ai."Crit_DMG", ai."Where_got_it", ai."Score"
      FROM "Drive_Disc_leveling" al
      JOIN "Drive_Disc" ai ON al."ID" = ai."ID"
      ORDER BY al."CreateDate";
    `;

    const rows = await localDb.unsafe(query);

    const artifacts = rows.map(row => ({
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
      addedSubstat: row.Added_substat,
      set: row.Set,
      type: row.Slot,
      main_stat: row.Main_Stat,
      number_of_substats: row.Number_of_substat,
      atk_percent: row.Percent_ATK,
      hp_percent: row.Percent_HP,
      def_percent: row.Percent_DEF,
      atk: row.ATK,
      hp: row.HP,
      defense: row.DEF,
      pen: row.PEN,
      ap: row.AP,
      crit_rate: row.Crit_Rate,
      crit_dmg: row.Crit_DMG,
      where_got_it: row.Where_got_it,
      score: row.Score,
    }));

    res.status(200).json(artifacts);
  } catch (error) {
    console.error("Error fetching artifact leveling list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = artifactLevelingListRouter;