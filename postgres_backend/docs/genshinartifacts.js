/**
 * @swagger
 * tags:
 *   - name: Genshin Artifacts
 *     description: API for retrieving Genshin Artifacts data
 */

/**
 * @swagger
 * /genshinartifacts:
 *   get:
 *     tags: [Genshin Artifacts]
 *     summary: Retrieve all artifacts
 *     description: Fetch all artifacts from the database.
 *     responses:
 *       200:
 *         description: A list of artifacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID:
 *                     type: integer
 *                   Set:
 *                     type: string
 *                   Type:
 *                     type: string
 *                   Main_Stat:
 *                     type: string
 *                   Number_of_substat:
 *                     type: integer
 *                   Percent_ATK:
 *                     type: integer
 *                   Percent_HP:
 *                     type: integer
 *                   Percent_DEF:
 *                     type: integer
 *                   ATK:
 *                     type: integer
 *                   HP:
 *                     type: integer
 *                   DEF:
 *                     type: integer
 *                   ER:
 *                     type: integer
 *                   EM:
 *                     type: integer
 *                   Crit_Rate:
 *                     type: integer
 *                   Crit_DMG:
 *                     type: integer
 *                   Where_got_it:
 *                     type: string
 *                   Score:
 *                     type: string
 *                   CreateDate:
 *                     type: string
 *                     format: date
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /genshinartifacts:
 *   post:
 *     tags: [Genshin Artifacts]
 *     summary: Create a new artifact
 *     description: Add a new artifact to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               set:
 *                 type: string
 *               type:
 *                 type: string
 *               main_stat:
 *                 type: string
 *               number_of_substats:
 *                 type: integer
 *               atk_percent:
 *                 type: integer
 *               hp_percent:
 *                 type: integer
 *               def_percent:
 *                 type: integer
 *               atk:
 *                 type: integer
 *               hp:
 *                 type: integer
 *               defense:
 *                 type: integer
 *               er:
 *                 type: integer
 *               em:
 *                 type: integer
 *               crit_rate:
 *                 type: integer
 *               crit_dmg:
 *                 type: integer
 *               where_got_it:
 *                 type: string
 *               score:
 *                 type: string
 *     responses:
 *       201:
 *         description: Artifact created successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /genshinartifacts/{artifact_id}:
 *   put:
 *     tags: [Genshin Artifacts]
 *     summary: Update an existing artifact
 *     description: Update the details of an artifact in the database.
 *     parameters:
 *       - in: path
 *         name: artifact_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the artifact to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               set:
 *                 type: string
 *               type:
 *                 type: string
 *               main_stat:
 *                 type: string
 *               number_of_substats:
 *                 type: integer
 *               atk_percent:
 *                 type: integer
 *               hp_percent:
 *                 type: integer
 *               def_percent:
 *                 type: integer
 *               atk:
 *                 type: integer
 *               hp:
 *                 type: integer
 *               defense:
 *                 type: integer
 *               er:
 *                 type: integer
 *               em:
 *                 type: integer
 *               crit_rate:
 *                 type: integer
 *               crit_dmg:
 *                 type: integer
 *               where_got_it:
 *                 type: string
 *               score:
 *                 type: string
 *     responses:
 *       200:
 *         description: Artifact updated successfully
 *       404:
 *         description: Artifact not found
 *       500:
 *         description: Internal Server Error
 */