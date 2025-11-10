const express = require("express");
const cors = require("cors");
const { localDb, cloudDb } = require("../db.js");

const searchArtifactsRouter = express.Router();
searchArtifactsRouter.use(cors());
searchArtifactsRouter.use(express.json());

searchArtifactsRouter.get("/", async (req, res) => {
  try {
    let query = `SELECT * FROM "Artifact_itself" WHERE 1=1`;
    const params = [];

    const queryParams = req.query;

    if (queryParams.set) {
      query += ` AND "Set" = $${params.length + 1}`;
      params.push(queryParams.set);
    }
    if (queryParams.type) {
      query += ` AND "Type" = $${params.length + 1}`;
      params.push(queryParams.type);
    }
    if (queryParams.main_stat) {
      query += ` AND "Main_Stat" = $${params.length + 1}`;
      params.push(queryParams.main_stat);
    }
    if (queryParams.number_of_substats) {
      query += ` AND "Number_of_substat" = $${params.length + 1}`;
      params.push(queryParams.number_of_substats);
    }
    if (queryParams.atk_percent) {
      query += ` AND "Percent_ATK" = $${params.length + 1}`;
      params.push(queryParams.atk_percent);
    }
    if (queryParams.hp_percent) {
      query += ` AND "Percent_HP" = $${params.length + 1}`;
      params.push(queryParams.hp_percent);
    }
    if (queryParams.def_percent) {
      query += ` AND "Percent_DEF" = $${params.length + 1}`;
      params.push(queryParams.def_percent);
    }
    if (queryParams.atk) {
      query += ` AND "ATK" = $${params.length + 1}`;
      params.push(queryParams.atk);
    }
    if (queryParams.hp) {
      query += ` AND "HP" = $${params.length + 1}`;
      params.push(queryParams.hp);
    }
    if (queryParams.defense) {
      query += ` AND "DEF" = $${params.length + 1}`;
      params.push(queryParams.defense);
    }
    if (queryParams.er) {
      query += ` AND "ER" = $${params.length + 1}`;
      params.push(queryParams.er);
    }
    if (queryParams.em) {
      query += ` AND "EM" = $${params.length + 1}`;
      params.push(queryParams.em);
    }
    if (queryParams.crit_rate) {
      query += ` AND "Crit_Rate" = $${params.length + 1}`;
      params.push(queryParams.crit_rate);
    }
    if (queryParams.crit_dmg) {
      query += ` AND "Crit_DMG" = $${params.length + 1}`;
      params.push(queryParams.crit_dmg);
    }
    if (queryParams.where_got_it) {
      query += ` AND "Where_got_it" = $${params.length + 1}`;
      params.push(queryParams.where_got_it);
    }
    if (queryParams.score) {
      query += ` AND "Score" = $${params.length + 1}`;
      params.push(queryParams.score);
    }

    const rows = await localDb.unsafe(query, params);

    const artifacts = rows.map(row => ({
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
    }));

    res.status(200).json(artifacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = searchArtifactsRouter;