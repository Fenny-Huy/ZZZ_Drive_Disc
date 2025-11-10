const express = require("express");
const cors = require("cors");
const { localDb, cloudDb } = require("../db.js");

const statisticsRouter = express.Router();
statisticsRouter.use(cors());
statisticsRouter.use(express.json());

statisticsRouter.get("/mainstat", async (req, res) => {
  try {
    // Query to fetch percentages of each type
    const typePercentagesQuery = `
      SELECT "Type", COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Artifact_itself") AS percentage, COUNT(*) as count
      FROM "Artifact_itself"
      GROUP BY "Type";
    `;
    const typePercentages = await localDb.unsafe(typePercentagesQuery);

    // Transform type percentages to match FastAPI output
    const formattedTypePercentages = typePercentages.map(row => [
      row.Type,
      parseFloat(row.percentage),
      parseInt(row.count, 10),
    ]);

    // Query to fetch percentages of each main stat grouped by type
    const mainStatPercentagesQuery = `
      SELECT "Type", "Main_Stat", COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Artifact_itself" WHERE "Type" = t."Type") AS percentage, COUNT(*) as count
      FROM "Artifact_itself" t
      GROUP BY "Type", "Main_Stat";
    `;
    const mainStatPercentages = await localDb.unsafe(mainStatPercentagesQuery);

    // Transform main stat percentages to match FastAPI output
    const formattedMainStatPercentages = mainStatPercentages.map(row => [
      row.Type,
      row.Main_Stat,
      parseFloat(row.percentage),
      parseInt(row.count, 10),
    ]);

    res.status(200).json({
      type_percentages: formattedTypePercentages,
      main_stat_percentages: formattedMainStatPercentages,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

statisticsRouter.get("/mainstat/:setname", async (req, res) => {
  const { setname } = req.params;
  try {
    // Query to fetch percentages of each type for the specific set
    const typePercentagesQuery = `
      SELECT "Type", COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Artifact_itself" WHERE "Set" = $1) AS percentage, COUNT(*) as count
      FROM "Artifact_itself"
      WHERE "Set" = $1
      GROUP BY "Type";
    `;
    const typePercentages = await localDb.unsafe(typePercentagesQuery, [setname]);

    // Transform type percentages to match FastAPI output
    const formattedTypePercentages = typePercentages.map(row => [
      row.Type,
      parseFloat(row.percentage),
      parseInt(row.count, 10),
    ]);

    // Query to fetch percentages of each main stat grouped by type for the specific set
    const mainStatPercentagesQuery = `
      SELECT "Type", "Main_Stat", COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Artifact_itself" WHERE "Type" = t."Type" AND "Set" = $1) AS percentage, COUNT(*) as count
      FROM "Artifact_itself" t
      WHERE "Set" = $1
      GROUP BY "Type", "Main_Stat";
    `;
    const mainStatPercentages = await localDb.unsafe(mainStatPercentagesQuery, [setname]);

    // Transform main stat percentages to match FastAPI output
    const formattedMainStatPercentages = mainStatPercentages.map(row => [
      row.Type,
      row.Main_Stat,
      parseFloat(row.percentage),
      parseInt(row.count, 10),
    ]);

    res.status(200).json({
      type_percentages: formattedTypePercentages,
      main_stat_percentages: formattedMainStatPercentages,
    });
  } catch (error) {
    console.error(`Error fetching statistics for set ${setname}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

statisticsRouter.get("/substats", async (req, res) => {
  try {
    const query = `
      SELECT "Type", "Main_Stat", COUNT("Type") AS "TypeCount", 
             SUM("Percent_ATK") AS "Percent_ATK", SUM("Percent_HP") AS "Percent_HP", SUM("Percent_DEF") AS "Percent_DEF", 
             SUM("ATK") AS "ATK", SUM("HP") AS "HP", SUM("DEF") AS "DEF", 
             SUM("ER") AS "ER", SUM("EM") AS "EM", SUM("Crit_Rate") AS "Crit_Rate", 
             SUM("Crit_DMG") AS "Crit_DMG", 
             SUM("Percent_ATK"+"Percent_HP"+"Percent_DEF"+"ATK"+"HP"+"DEF"+"ER"+"EM"+"Crit_Rate"+"Crit_DMG") AS "SubstatCount"
      FROM "Artifact_itself"
      GROUP BY "Type", "Main_Stat";
    `;

    const rows = await localDb.unsafe(query);
    const artifactsWithSubs = rows.map(row => ({
      type: row.Type,
      main_stat: row.Main_Stat,
      ArtifactCount: parseInt(row.TypeCount, 10),
      sub_ATK_per: parseFloat(row.Percent_ATK),
      sub_HP_per: parseFloat(row.Percent_HP),
      sub_DEF_per: parseFloat(row.Percent_DEF),
      sub_ATK: parseInt(row.ATK, 10),
      sub_HP: parseInt(row.HP, 10),
      sub_DEF: parseInt(row.DEF, 10),
      sub_ER: parseInt(row.ER, 10),
      sub_EM: parseInt(row.EM, 10),
      sub_Crit_Rate: parseFloat(row.Crit_Rate),
      sub_Crit_DMG: parseFloat(row.Crit_DMG),
      substatCount: parseInt(row.SubstatCount, 10),
    }));

    res.status(200).json(artifactsWithSubs);
  } catch (error) {
    console.error("Error fetching substats statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

statisticsRouter.get("/substats/:setname", async (req, res) => {
  const { setname } = req.params;
  try {
    const query = `
      SELECT "Type", "Main_Stat", COUNT("Type") AS "TypeCount", 
             SUM("Percent_ATK") AS "Percent_ATK", SUM("Percent_HP") AS "Percent_HP", SUM("Percent_DEF") AS "Percent_DEF", 
             SUM("ATK") AS "ATK", SUM("HP") AS "HP", SUM("DEF") AS "DEF", 
             SUM("ER") AS "ER", SUM("EM") AS "EM", SUM("Crit_Rate") AS "Crit_Rate", 
             SUM("Crit_DMG") AS "Crit_DMG", 
             SUM("Percent_ATK"+"Percent_HP"+"Percent_DEF"+"ATK"+"HP"+"DEF"+"ER"+"EM"+"Crit_Rate"+"Crit_DMG") AS "SubstatCount"
      FROM "Artifact_itself"
      WHERE "Set" = $1
      GROUP BY "Type", "Main_Stat";
    `;

    const rows = await localDb.unsafe(query, [setname]);
    const artifactsWithSubs = rows.map(row => ({
      type: row.Type,
      main_stat: row.Main_Stat,
      ArtifactCount: parseInt(row.TypeCount, 10),
      sub_ATK_per: parseFloat(row.Percent_ATK),
      sub_HP_per: parseFloat(row.Percent_HP),
      sub_DEF_per: parseFloat(row.Percent_DEF),
      sub_ATK: parseInt(row.ATK, 10),
      sub_HP: parseInt(row.HP, 10),
      sub_DEF: parseInt(row.DEF, 10),
      sub_ER: parseInt(row.ER, 10),
      sub_EM: parseInt(row.EM, 10),
      sub_Crit_Rate: parseFloat(row.Crit_Rate),
      sub_Crit_DMG: parseFloat(row.Crit_DMG),
      substatCount: parseInt(row.SubstatCount, 10),
    }));

    res.status(200).json(artifactsWithSubs);
  } catch (error) {
    console.error(`Error fetching substats statistics for set ${setname}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

statisticsRouter.get("/leveling", async (req, res) => {
  try {
    const query = `
      SELECT 
          i."Type", 
          i."Main_Stat", 
          COUNT(*) AS "TypeCount", 
          SUM("Percent_ATK") AS "Percent_ATK", 
          SUM("Percent_HP") AS "Percent_HP", 
          SUM("Percent_DEF") AS "Percent_DEF", 
          SUM("ATK") AS "ATK", 
          SUM("HP") AS "HP", 
          SUM("DEF") AS "DEF", 
          SUM("ER") AS "ER", 
          SUM("EM") AS "EM", 
          SUM("Crit_Rate") AS "Crit_Rate", 
          SUM("Crit_DMG") AS "Crit_DMG", 
          SUM("Percent_ATK" + "Percent_HP" + "Percent_DEF" + "ATK" + "HP" + "DEF" + "ER" + "EM" + "Crit_Rate" + "Crit_DMG") AS "SubstatCount", 
          SUM("L_HP") AS "L_HP", 
          SUM("L_ATK") AS "L_ATK", 
          SUM("L_DEF") AS "L_DEF", 
          SUM("L_Percent_HP") AS "L_HP_per", 
          SUM("L_Percent_ATK") AS "L_ATK_per", 
          SUM("L_Percent_DEF") AS "L_DEF_per", 
          SUM("L_EM") AS "L_EM", 
          SUM("L_ER") AS "L_ER", 
          SUM("L_Crit_Rate") AS "L_Crit_Rate", 
          SUM("L_Crit_DMG") AS "L_Crit_DMG",
          SUM("L_HP" + "L_ATK" + "L_DEF" + "L_Percent_HP" + "L_Percent_ATK" + "L_Percent_DEF" + "L_EM" + "L_ER" + "L_Crit_Rate" + "L_Crit_DMG") AS "TotalRolls",
          SUM(CASE WHEN l."Added_substat" = 'ATK' THEN 1 ELSE 0 END) AS "AddedSubstat_ATK",
          SUM(CASE WHEN l."Added_substat" = 'DEF' THEN 1 ELSE 0 END) AS "AddedSubstat_DEF",
          SUM(CASE WHEN l."Added_substat" = 'HP' THEN 1 ELSE 0 END) AS "AddedSubstat_HP",
          SUM(CASE WHEN l."Added_substat" = 'Percent_ATK' THEN 1 ELSE 0 END) AS "AddedSubstat_Percent_ATK",
          SUM(CASE WHEN l."Added_substat" = 'Percent_DEF' THEN 1 ELSE 0 END) AS "AddedSubstat_Percent_DEF",
          SUM(CASE WHEN l."Added_substat" = 'Percent_HP' THEN 1 ELSE 0 END) AS "AddedSubstat_Percent_HP",
          SUM(CASE WHEN l."Added_substat" = 'ER' THEN 1 ELSE 0 END) AS "AddedSubstat_ER",
          SUM(CASE WHEN l."Added_substat" = 'EM' THEN 1 ELSE 0 END) AS "AddedSubstat_EM",
          SUM(CASE WHEN l."Added_substat" = 'Crit_Rate' THEN 1 ELSE 0 END) AS "AddedSubstat_Crit_Rate",
          SUM(CASE WHEN l."Added_substat" = 'Crit_DMG' THEN 1 ELSE 0 END) AS "AddedSubstat_Crit_DMG",
          SUM(CASE WHEN l."Added_substat" = 'None' THEN 1 ELSE 0 END) AS "AddedSubstat_None"
      FROM 
          "Artifact_leveling" l
      INNER JOIN 
          "Artifact_itself" i
      ON 
          l."ID" = i."ID"
      GROUP BY 
          i."Type", 
          i."Main_Stat";
    `;

    const rows = await localDb.unsafe(query);
    const artifactsWithSubs = rows.map(row => ({
      type: row.Type,
      main_stat: row.Main_Stat,
      ArtifactCount: parseInt(row.TypeCount, 10),
      sub_ATK_per: parseFloat(row.Percent_ATK),
      sub_HP_per: parseFloat(row.Percent_HP),
      sub_DEF_per: parseFloat(row.Percent_DEF),
      sub_ATK: parseInt(row.ATK, 10),
      sub_HP: parseInt(row.HP, 10),
      sub_DEF: parseInt(row.DEF, 10),
      sub_ER: parseInt(row.ER, 10),
      sub_EM: parseInt(row.EM, 10),
      sub_Crit_Rate: parseFloat(row.Crit_Rate),
      sub_Crit_DMG: parseFloat(row.Crit_DMG),
      substatCount: parseInt(row.SubstatCount, 10),
      roll_HP: parseInt(row.L_HP, 10),
      roll_ATK: parseInt(row.L_ATK, 10),
      roll_DEF: parseInt(row.L_DEF, 10),
      roll_HP_per: parseFloat(row.L_HP_per),
      roll_ATK_per: parseFloat(row.L_ATK_per),
      roll_DEF_per: parseFloat(row.L_DEF_per),
      roll_EM: parseInt(row.L_EM, 10),
      roll_ER: parseInt(row.L_ER, 10),
      roll_Crit_Rate: parseFloat(row.L_Crit_Rate),
      roll_Crit_DMG: parseFloat(row.L_Crit_DMG),
      TotalRoll: parseInt(row.TotalRolls, 10),
      added_ATK: parseInt(row.AddedSubstat_ATK, 10),
      added_DEF: parseInt(row.AddedSubstat_DEF, 10),
      added_HP: parseInt(row.AddedSubstat_HP, 10),
      added_ATK_per: parseInt(row.AddedSubstat_Percent_ATK, 10),
      added_DEF_per: parseInt(row.AddedSubstat_Percent_DEF, 10),
      added_HP_per: parseInt(row.AddedSubstat_Percent_HP, 10),
      added_ER: parseInt(row.AddedSubstat_ER, 10),
      added_EM: parseInt(row.AddedSubstat_EM, 10),
      added_Crit_Rate: parseInt(row.AddedSubstat_Crit_Rate, 10),
      added_Crit_DMG: parseInt(row.AddedSubstat_Crit_DMG, 10),
      added_None: parseInt(row.AddedSubstat_None, 10),
    }));

    res.status(200).json(artifactsWithSubs);
  } catch (error) {
    console.error("Error fetching leveling statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

statisticsRouter.get("/leveling/:setname", async (req, res) => {
  const { setname } = req.params;
  try {
    const query = `
      SELECT 
          i."Type", 
          i."Main_Stat", 
          COUNT(*) AS "TypeCount", 
          SUM("Percent_ATK") AS "Percent_ATK", 
          SUM("Percent_HP") AS "Percent_HP", 
          SUM("Percent_DEF") AS "Percent_DEF", 
          SUM("ATK") AS "ATK", 
          SUM("HP") AS "HP", 
          SUM("DEF") AS "DEF", 
          SUM("ER") AS "ER", 
          SUM("EM") AS "EM", 
          SUM("Crit_Rate") AS "Crit_Rate", 
          SUM("Crit_DMG") AS "Crit_DMG", 
          SUM("Percent_ATK" + "Percent_HP" + "Percent_DEF" + "ATK" + "HP" + "DEF" + "ER" + "EM" + "Crit_Rate" + "Crit_DMG") AS "SubstatCount", 
          SUM("L_HP") AS "L_HP", 
          SUM("L_ATK") AS "L_ATK", 
          SUM("L_DEF") AS "L_DEF", 
          SUM("L_Percent_HP") AS "L_HP_per", 
          SUM("L_Percent_ATK") AS "L_ATK_per", 
          SUM("L_Percent_DEF") AS "L_DEF_per", 
          SUM("L_EM") AS "L_EM", 
          SUM("L_ER") AS "L_ER", 
          SUM("L_Crit_Rate") AS "L_Crit_Rate", 
          SUM("L_Crit_DMG") AS "L_Crit_DMG",
          SUM("L_HP" + "L_ATK" + "L_DEF" + "L_Percent_HP" + "L_Percent_ATK" + "L_Percent_DEF" + "L_EM" + "L_ER" + "L_Crit_Rate" + "L_Crit_DMG") AS "TotalRolls",
          SUM(CASE WHEN l."Added_substat" = 'ATK' THEN 1 ELSE 0 END) AS "AddedSubstat_ATK",
          SUM(CASE WHEN l."Added_substat" = 'DEF' THEN 1 ELSE 0 END) AS "AddedSubstat_DEF",
          SUM(CASE WHEN l."Added_substat" = 'HP' THEN 1 ELSE 0 END) AS "AddedSubstat_HP",
          SUM(CASE WHEN l."Added_substat" = 'Percent_ATK' THEN 1 ELSE 0 END) AS "AddedSubstat_Percent_ATK",
          SUM(CASE WHEN l."Added_substat" = 'Percent_DEF' THEN 1 ELSE 0 END) AS "AddedSubstat_Percent_DEF",
          SUM(CASE WHEN l."Added_substat" = 'Percent_HP' THEN 1 ELSE 0 END) AS "AddedSubstat_Percent_HP",
          SUM(CASE WHEN l."Added_substat" = 'ER' THEN 1 ELSE 0 END) AS "AddedSubstat_ER",
          SUM(CASE WHEN l."Added_substat" = 'EM' THEN 1 ELSE 0 END) AS "AddedSubstat_EM",
          SUM(CASE WHEN l."Added_substat" = 'Crit_Rate' THEN 1 ELSE 0 END) AS "AddedSubstat_Crit_Rate",
          SUM(CASE WHEN l."Added_substat" = 'Crit_DMG' THEN 1 ELSE 0 END) AS "AddedSubstat_Crit_DMG",
          SUM(CASE WHEN l."Added_substat" = 'None' THEN 1 ELSE 0 END) AS "AddedSubstat_None"
      FROM 
          "Artifact_leveling" l
      INNER JOIN 
          "Artifact_itself" i
      ON 
          l."ID" = i."ID"
      WHERE 
          i."Set" = $1
      GROUP BY 
          i."Type", 
          i."Main_Stat";
    `;

    const rows = await localDb.unsafe(query, [setname]);
    const artifactsWithSubs = rows.map(row => ({
      type: row.Type,
      main_stat: row.Main_Stat,
      ArtifactCount: parseInt(row.TypeCount, 10),
      sub_ATK_per: parseFloat(row.Percent_ATK),
      sub_HP_per: parseFloat(row.Percent_HP),
      sub_DEF_per: parseFloat(row.Percent_DEF),
      sub_ATK: parseInt(row.ATK, 10),
      sub_HP: parseInt(row.HP, 10),
      sub_DEF: parseInt(row.DEF, 10),
      sub_ER: parseInt(row.ER, 10),
      sub_EM: parseInt(row.EM, 10),
      sub_Crit_Rate: parseFloat(row.Crit_Rate),
      sub_Crit_DMG: parseFloat(row.Crit_DMG),
      substatCount: parseInt(row.SubstatCount, 10),
      roll_HP: parseInt(row.L_HP, 10),
      roll_ATK: parseInt(row.L_ATK, 10),
      roll_DEF: parseInt(row.L_DEF, 10),
      roll_HP_per: parseFloat(row.L_HP_per),
      roll_ATK_per: parseFloat(row.L_ATK_per),
      roll_DEF_per: parseFloat(row.L_DEF_per),
      roll_EM: parseInt(row.L_EM, 10),
      roll_ER: parseInt(row.L_ER, 10),
      roll_Crit_Rate: parseFloat(row.L_Crit_Rate),
      roll_Crit_DMG: parseFloat(row.L_Crit_DMG),
      TotalRoll: parseInt(row.TotalRolls, 10),
      added_ATK: parseInt(row.AddedSubstat_ATK, 10),
      added_DEF: parseInt(row.AddedSubstat_DEF, 10),
      added_HP: parseInt(row.AddedSubstat_HP, 10),
      added_ATK_per: parseInt(row.AddedSubstat_Percent_ATK, 10),
      added_DEF_per: parseInt(row.AddedSubstat_Percent_DEF, 10),
      added_HP_per: parseInt(row.AddedSubstat_Percent_HP, 10),
      added_ER: parseInt(row.AddedSubstat_ER, 10),
      added_EM: parseInt(row.AddedSubstat_EM, 10),
      added_Crit_Rate: parseInt(row.AddedSubstat_Crit_Rate, 10),
      added_Crit_DMG: parseInt(row.AddedSubstat_Crit_DMG, 10),
      added_None: parseInt(row.AddedSubstat_None, 10),
    }));

    res.status(200).json(artifactsWithSubs);
  } catch (error) {
    console.error(`Error fetching leveling statistics for set ${setname}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

statisticsRouter.get("/levelinginvestment", async (req, res) => {
  try {
    const query = `
      SELECT 
          i."Type",
          i."Set",
          COUNT(*) AS "TypeCount",
          SUM("L_HP" + "L_ATK" + "L_DEF" + "L_Percent_HP" + "L_Percent_ATK" + "L_Percent_DEF" + "L_EM" + "L_ER" + "L_Crit_Rate" + "L_Crit_DMG") AS "TotalRolls"
      FROM 
          "Artifact_leveling" l
      INNER JOIN 
          "Artifact_itself" i
      ON 
          l."ID" = i."ID"
      GROUP BY 
          i."Type",
          i."Set"
      ORDER BY "TotalRolls" DESC;
    `;

    const rows = await localDb.unsafe(query);
    const artifactsWithSubs = rows.map(row => ({
      type: row.Type,
      set: row.Set,
      ArtifactCount: parseInt(row.TypeCount, 10),
      TotalRoll: parseInt(row.TotalRolls, 10),
    }));

    res.status(200).json(artifactsWithSubs);
  } catch (error) {
    console.error("Error fetching leveling investment statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = statisticsRouter;