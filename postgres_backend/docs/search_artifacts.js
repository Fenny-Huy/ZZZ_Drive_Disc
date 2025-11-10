/**
 * @swagger
 * /search_artifacts:
 *   get:
 *     tags: [Search Artifacts]
 *     summary: Search for artifacts based on query parameters
 *     description: Fetch artifacts from the database that match the provided query parameters.
 *     parameters:
 *       - in: query
 *         name: set
 *         schema:
 *           type: string
 *         description: Artifact set name
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Artifact type
 *       - in: query
 *         name: main_stat
 *         schema:
 *           type: string
 *         description: Main stat of the artifact
 *       - in: query
 *         name: number_of_substats
 *         schema:
 *           type: integer
 *         description: Number of substats
 *       - in: query
 *         name: atk_percent
 *         schema:
 *           type: integer
 *         description: Percentage ATK
 *       - in: query
 *         name: hp_percent
 *         schema:
 *           type: integer
 *         description: Percentage HP
 *       - in: query
 *         name: def_percent
 *         schema:
 *           type: integer
 *         description: Percentage DEF
 *       - in: query
 *         name: atk
 *         schema:
 *           type: integer
 *         description: Flat ATK
 *       - in: query
 *         name: hp
 *         schema:
 *           type: integer
 *         description: Flat HP
 *       - in: query
 *         name: defense
 *         schema:
 *           type: integer
 *         description: Flat DEF
 *       - in: query
 *         name: er
 *         schema:
 *           type: integer
 *         description: Energy Recharge
 *       - in: query
 *         name: em
 *         schema:
 *           type: integer
 *         description: Elemental Mastery
 *       - in: query
 *         name: crit_rate
 *         schema:
 *           type: integer
 *         description: Critical Rate
 *       - in: query
 *         name: crit_dmg
 *         schema:
 *           type: integer
 *         description: Critical Damage
 *       - in: query
 *         name: where_got_it
 *         schema:
 *           type: string
 *         description: Source of the artifact
 *       - in: query
 *         name: score
 *         schema:
 *           type: string
 *         description: Artifact score
 *     responses:
 *       200:
 *         description: A list of artifacts matching the query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   set:
 *                     type: string
 *                   type:
 *                     type: string
 *                   main_stat:
 *                     type: string
 *                   number_of_substats:
 *                     type: integer
 *                   atk_percent:
 *                     type: integer
 *                   hp_percent:
 *                     type: integer
 *                   def_percent:
 *                     type: integer
 *                   atk:
 *                     type: integer
 *                   hp:
 *                     type: integer
 *                   defense:
 *                     type: integer
 *                   er:
 *                     type: integer
 *                   em:
 *                     type: integer
 *                   crit_rate:
 *                     type: integer
 *                   crit_dmg:
 *                     type: integer
 *                   where_got_it:
 *                     type: string
 *                   score:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 */