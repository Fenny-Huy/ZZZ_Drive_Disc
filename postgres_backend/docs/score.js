/**
 * @swagger
 * /score:
 *   get:
 *     tags:
 *       - Score Routes
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
 * /score/set:
 *   get:
 *     tags:
 *       - Score Routes
 *     summary: Retrieve artifact scores grouped by set
 *     responses:
 *       200:
 *         description: A list of artifact scores grouped by set
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   score:
 *                     type: string
 *                   set:
 *                     type: string
 *                   count:
 *                     type: integer
 *
 * /score/where:
 *   get:
 *     tags:
 *       - Score Routes
 *     summary: Retrieve artifact scores grouped by source
 *     responses:
 *       200:
 *         description: A list of artifact scores grouped by source
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   score:
 *                     type: string
 *                   where:
 *                     type: string
 *                   count:
 *                     type: integer
 *
 * /score/set_where:
 *   get:
 *     tags:
 *       - Score Routes
 *     summary: Retrieve artifact scores grouped by set and source
 *     responses:
 *       200:
 *         description: A list of artifact scores grouped by set and source
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   score:
 *                     type: string
 *                   set:
 *                     type: string
 *                   where:
 *                     type: string
 *                   count:
 *                     type: integer
 */