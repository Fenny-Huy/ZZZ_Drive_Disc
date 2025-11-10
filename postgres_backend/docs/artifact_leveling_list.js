/**
 * @swagger
 * /artifactlevelinglist:
 *   get:
 *     summary: Fetch all artifact leveling list
 *     tags:
 *       - Artifact Leveling
 *     responses:
 *       200:
 *         description: A list of artifact leveling data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   L_HP:
 *                     type: number
 *                   L_ATK:
 *                     type: number
 *                   L_DEF:
 *                     type: number
 *                   L_HP_per:
 *                     type: number
 *                   L_ATK_per:
 *                     type: number
 *                   L_DEF_per:
 *                     type: number
 *                   L_EM:
 *                     type: number
 *                   L_ER:
 *                     type: number
 *                   L_CritRate:
 *                     type: number
 *                   L_CritDMG:
 *                     type: number
 *                   addedSubstat:
 *                     type: string
 *                   set:
 *                     type: string
 *                   type:
 *                     type: string
 *                   main_stat:
 *                     type: string
 *                   number_of_substats:
 *                     type: integer
 *                   atk_percent:
 *                     type: number
 *                   hp_percent:
 *                     type: number
 *                   def_percent:
 *                     type: number
 *                   atk:
 *                     type: number
 *                   hp:
 *                     type: number
 *                   defense:
 *                     type: number
 *                   er:
 *                     type: number
 *                   em:
 *                     type: number
 *                   crit_rate:
 *                     type: number
 *                   crit_dmg:
 *                     type: number
 *                   where_got_it:
 *                     type: string
 *                   score:
 *                     type: string
 */