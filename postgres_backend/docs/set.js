/**
 * @swagger
 * /set/set:
 *   get:
 *     tags:
 *       - Set Routes
 *     summary: Retrieve artifact sets with their counts
 *     responses:
 *       200:
 *         description: A list of artifact sets with their counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   set:
 *                     type: string
 *                   count:
 *                     type: integer
 *
 * /set/where:
 *   get:
 *     tags:
 *       - Set Routes
 *     summary: Retrieve artifact sources with their counts
 *     responses:
 *       200:
 *         description: A list of artifact sources with their counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   where:
 *                     type: string
 *                   count:
 *                     type: integer
 *
 * /set/score:
 *   get:
 *     tags:
 *       - Set Routes
 *     summary: Retrieve artifact scores with their counts
 *     responses:
 *       200:
 *         description: A list of artifact scores with their counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   score:
 *                     type: string
 *                   count:
 *                     type: integer
 *
 * /set/set_where:
 *   get:
 *     tags:
 *       - Set Routes
 *     summary: Retrieve statistics for artifact sets and their sources
 *     responses:
 *       200:
 *         description: A list of artifact sets and their sources with counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   set:
 *                     type: string
 *                   where:
 *                     type: string
 *                   count:
 *                     type: integer
 */