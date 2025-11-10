/**
 * @swagger
 * /artifact/{artifact_id}:
 *   get:
 *     tags: [Artifact]
 *     summary: Fetch a single artifact
 *     description: Retrieve a specific artifact by its ID.
 *     parameters:
 *       - in: path
 *         name: artifact_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the artifact to fetch
 *     responses:
 *       200:
 *         description: Artifact retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 set:
 *                   type: string
 *                 type:
 *                   type: string
 *                 main_stat:
 *                   type: string
 *                 number_of_substats:
 *                   type: integer
 *                 atk_percent:
 *                   type: integer
 *                 hp_percent:
 *                   type: integer
 *                 def_percent:
 *                   type: integer
 *                 atk:
 *                   type: integer
 *                 hp:
 *                   type: integer
 *                 defense:
 *                   type: integer
 *                 er:
 *                   type: integer
 *                 em:
 *                   type: integer
 *                 crit_rate:
 *                   type: integer
 *                 crit_dmg:
 *                   type: integer
 *                 where_got_it:
 *                   type: string
 *                 score:
 *                   type: string
 *       404:
 *         description: Artifact not found
 *       500:
 *         description: Internal Server Error
 */