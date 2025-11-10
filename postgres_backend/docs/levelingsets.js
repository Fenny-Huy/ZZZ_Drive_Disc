/**
 * @swagger
 * /levelingsets:
 *   get:
 *     summary: Fetch all leveling sets
 *     tags:
 *       - Leveling Sets
 *     responses:
 *       200:
 *         description: A list of leveling sets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */