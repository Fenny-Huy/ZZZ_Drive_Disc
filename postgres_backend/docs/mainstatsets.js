/**
 * @swagger
 * /mainstatsets:
 *   get:
 *     summary: Fetch all artifact sets
 *     tags:
 *       - Main Stat Sets
 *     responses:
 *       200:
 *         description: A list of artifact sets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */