/**
 * @swagger
 * /statistics/mainstat:
 *   get:
 *     summary: Fetch statistics of main stats and types
 *     tags:
 *       - Statistics
 *     responses:
 *       200:
 *         description: Statistics of artifact types and main stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type_percentages:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 *                 main_stat_percentages:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 */
/**
 * @swagger
 * /statistics/mainstat/{setname}:
 *   get:
 *     summary: Fetch statistics of main stats and types for a specific set
 *     tags:
 *       - Statistics
 *     parameters:
 *       - in: path
 *         name: setname
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the artifact set
 *     responses:
 *       200:
 *         description: Statistics of artifact types and main stats for the specified set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type_percentages:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 *                 main_stat_percentages:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 */
/**
 * @swagger
 * /statistics/substats:
 *   get:
 *     summary: Fetch statistics of substats
 *     tags:
 *       - Statistics
 *     responses:
 *       200:
 *         description: Statistics of artifact substats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   main_stat:
 *                     type: string
 *                   ArtifactCount:
 *                     type: integer
 *                   sub_ATK_per:
 *                     type: number
 *                   sub_HP_per:
 *                     type: number
 *                   sub_DEF_per:
 *                     type: number
 *                   sub_ATK:
 *                     type: number
 *                   sub_HP:
 *                     type: number
 *                   sub_DEF:
 *                     type: number
 *                   sub_ER:
 *                     type: number
 *                   sub_EM:
 *                     type: number
 *                   sub_Crit_Rate:
 *                     type: number
 *                   sub_Crit_DMG:
 *                     type: number
 *                   substatCount:
 *                     type: number
 */
/**
 * @swagger
 * /statistics/substats/{setname}:
 *   get:
 *     summary: Fetch statistics of substats for a specific set
 *     tags:
 *       - Statistics
 *     parameters:
 *       - in: path
 *         name: setname
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the artifact set
 *     responses:
 *       200:
 *         description: Statistics of artifact substats for the specified set
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   main_stat:
 *                     type: string
 *                   ArtifactCount:
 *                     type: integer
 *                   sub_ATK_per:
 *                     type: number
 *                   sub_HP_per:
 *                     type: number
 *                   sub_DEF_per:
 *                     type: number
 *                   sub_ATK:
 *                     type: integer
 *                   sub_HP:
 *                     type: integer
 *                   sub_DEF:
 *                     type: integer
 *                   sub_ER:
 *                     type: integer
 *                   sub_EM:
 *                     type: integer
 *                   sub_Crit_Rate:
 *                     type: number
 *                   sub_Crit_DMG:
 *                     type: number
 *                   substatCount:
 *                     type: integer
 */
/**
 * @swagger
 * /statistics/leveling:
 *   get:
 *     summary: Fetch statistics of artifact leveling
 *     tags:
 *       - Statistics
 *     responses:
 *       200:
 *         description: Statistics of artifact leveling
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   main_stat:
 *                     type: string
 *                   ArtifactCount:
 *                     type: integer
 *                   sub_ATK_per:
 *                     type: number
 *                   sub_HP_per:
 *                     type: number
 *                   sub_DEF_per:
 *                     type: number
 *                   sub_ATK:
 *                     type: integer
 *                   sub_HP:
 *                     type: integer
 *                   sub_DEF:
 *                     type: integer
 *                   sub_ER:
 *                     type: integer
 *                   sub_EM:
 *                     type: integer
 *                   sub_Crit_Rate:
 *                     type: number
 *                   sub_Crit_DMG:
 *                     type: number
 *                   substatCount:
 *                     type: integer
 *                   roll_HP:
 *                     type: integer
 *                   roll_ATK:
 *                     type: integer
 *                   roll_DEF:
 *                     type: integer
 *                   roll_HP_per:
 *                     type: number
 *                   roll_ATK_per:
 *                     type: number
 *                   roll_DEF_per:
 *                     type: number
 *                   roll_EM:
 *                     type: integer
 *                   roll_ER:
 *                     type: integer
 *                   roll_Crit_Rate:
 *                     type: number
 *                   roll_Crit_DMG:
 *                     type: number
 *                   TotalRoll:
 *                     type: integer
 *                   added_ATK:
 *                     type: integer
 *                   added_DEF:
 *                     type: integer
 *                   added_HP:
 *                     type: integer
 *                   added_ATK_per:
 *                     type: integer
 *                   added_DEF_per:
 *                     type: integer
 *                   added_HP_per:
 *                     type: integer
 *                   added_ER:
 *                     type: integer
 *                   added_EM:
 *                     type: integer
 *                   added_Crit_Rate:
 *                     type: integer
 *                   added_Crit_DMG:
 *                     type: integer
 *                   added_None:
 *                     type: integer
 */
/**
 * @swagger
 * /statistics/leveling/{setname}:
 *   get:
 *     summary: Fetch statistics of artifact leveling for a specific set
 *     tags:
 *       - Statistics
 *     parameters:
 *       - in: path
 *         name: setname
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the artifact set
 *     responses:
 *       200:
 *         description: Statistics of artifact leveling for the specified set
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   main_stat:
 *                     type: string
 *                   ArtifactCount:
 *                     type: integer
 *                   sub_ATK_per:
 *                     type: number
 *                   sub_HP_per:
 *                     type: number
 *                   sub_DEF_per:
 *                     type: number
 *                   sub_ATK:
 *                     type: integer
 *                   sub_HP:
 *                     type: integer
 *                   sub_DEF:
 *                     type: integer
 *                   sub_ER:
 *                     type: integer
 *                   sub_EM:
 *                     type: integer
 *                   sub_Crit_Rate:
 *                     type: number
 *                   sub_Crit_DMG:
 *                     type: number
 *                   substatCount:
 *                     type: integer
 *                   roll_HP:
 *                     type: integer
 *                   roll_ATK:
 *                     type: integer
 *                   roll_DEF:
 *                     type: integer
 *                   roll_HP_per:
 *                     type: number
 *                   roll_ATK_per:
 *                     type: number
 *                   roll_DEF_per:
 *                     type: number
 *                   roll_EM:
 *                     type: integer
 *                   roll_ER:
 *                     type: integer
 *                   roll_Crit_Rate:
 *                     type: number
 *                   roll_Crit_DMG:
 *                     type: number
 *                   TotalRoll:
 *                     type: integer
 *                   added_ATK:
 *                     type: integer
 *                   added_DEF:
 *                     type: integer
 *                   added_HP:
 *                     type: integer
 *                   added_ATK_per:
 *                     type: integer
 *                   added_DEF_per:
 *                     type: integer
 *                   added_HP_per:
 *                     type: integer
 *                   added_ER:
 *                     type: integer
 *                   added_EM:
 *                     type: integer
 *                   added_Crit_Rate:
 *                     type: integer
 *                   added_Crit_DMG:
 *                     type: integer
 *                   added_None:
 *                     type: integer
 */
/**
 * @swagger
 * /statistics/levelinginvestment:
 *   get:
 *     summary: Fetch leveling investment statistics
 *     tags:
 *       - Statistics
 *     responses:
 *       200:
 *         description: Leveling investment statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   set:
 *                     type: string
 *                   ArtifactCount:
 *                     type: integer
 *                   TotalRoll:
 *                     type: integer
 */