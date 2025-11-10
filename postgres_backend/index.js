const express = require('express');
const { Pool } = require('pg');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
const port = 5000;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'your_supabase_connection_string_here',
});

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Genshin Artifacts API',
      version: '1.0.0',
      description: 'API for fetching Genshin Artifacts',
    },
  },
  apis: ['./docs/*.js'], // Adjusted to include all files in the docs folder
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const genshinArtifactsRouter = require('./api/genshinartifacts');
const searchArtifactsRouter = require("./api/search_artifacts");
const artifactLevelingRouter = require("./api/artifact_leveling");
const artifactLevelingIdsRouter = require("./api/artifact_leveling_ids");
const artifactRouter = require("./api/artifact");
const artifactLevelingListRouter = require("./api/artifact_leveling_list");
const statisticsRouter = require("./api/statistics");
const mainstatsetsRouter = require("./api/mainstatsets");
const levelingsetsRouter = require("./api/levelingsets");
const setRouter = require("./api/set");
const scoreRouter = require("./api/score");

// Use the genshinartifacts API router
app.use('/genshinartifacts', genshinArtifactsRouter);

// Use the search_artifacts API router
app.use("/search_artifacts", searchArtifactsRouter);

// Use the artifact_leveling API router
app.use("/artifactleveling", artifactLevelingRouter);

// Use the artifact_leveling_ids API router
app.use("/artifactlevelingids", artifactLevelingIdsRouter);

// Use the artifact API router
app.use("/artifact", artifactRouter);

// Use the artifact_leveling_list API router
app.use("/artifactlevelinglist", artifactLevelingListRouter);

// Use the statistics API router
app.use("/statistics", statisticsRouter);

// Use the mainstatsets API router
app.use("/mainstatsets", mainstatsetsRouter);

// Use the levelingsets API router
app.use("/levelingsets", levelingsetsRouter);

// Use the set API router
app.use("/set", setRouter);

// Use the score API router
app.use("/score", scoreRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});