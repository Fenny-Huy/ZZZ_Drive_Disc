/**
 * @swagger
 * /artifactleveling:
 *   post:
 *     tags: [Artifact Leveling]
 *     summary: Insert or update an artifact leveling record
 *     description: Add or update an artifact leveling record in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Artifact ID
 *               L_HP:
 *                 type: integer
 *                 description: Leveling HP
 *               L_ATK:
 *                 type: integer
 *                 description: Leveling ATK
 *               L_DEF:
 *                 type: integer
 *                 description: Leveling DEF
 *               L_HP_per:
 *                 type: integer
 *                 description: Leveling Percent HP
 *               L_ATK_per:
 *                 type: integer
 *                 description: Leveling Percent ATK
 *               L_DEF_per:
 *                 type: integer
 *                 description: Leveling Percent DEF
 *               L_EM:
 *                 type: integer
 *                 description: Leveling Elemental Mastery
 *               L_ER:
 *                 type: integer
 *                 description: Leveling Energy Recharge
 *               L_CritRate:
 *                 type: integer
 *                 description: Leveling Critical Rate
 *               L_CritDMG:
 *                 type: integer
 *                 description: Leveling Critical Damage
 *               addedSubstat:
 *                 type: string
 *                 description: Added substat
 *     responses:
 *       200:
 *         description: Artifact leveling record added/updated successfully
 *       500:
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /artifactleveling/{artifact_id}:
 *   get:
 *     tags: [Artifact Leveling]
 *     summary: Fetch a single artifact leveling record
 *     description: Retrieve a specific artifact leveling record by its ID.
 *     parameters:
 *       - in: path
 *         name: artifact_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the artifact leveling record to fetch
 *     responses:
 *       200:
 *         description: Artifact leveling record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 L_HP:
 *                   type: integer
 *                 L_ATK:
 *                   type: integer
 *                 L_DEF:
 *                   type: integer
 *                 L_HP_per:
 *                   type: integer
 *                 L_ATK_per:
 *                   type: integer
 *                 L_DEF_per:
 *                   type: integer
 *                 L_EM:
 *                   type: integer
 *                 L_ER:
 *                   type: integer
 *                 L_CritRate:
 *                   type: integer
 *                 L_CritDMG:
 *                   type: integer
 *                 addedSubstat:
 *                   type: string
 *       404:
 *         description: Artifact leveling record not found
 *       500:
 *         description: Internal Server Error
 */