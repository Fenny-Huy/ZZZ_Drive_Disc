const postgres = require('postgres');
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config({override: true});

// Cloud database connection (Supabase)
const cloudConnectionString = process.env.DATABASE_URL;
const cloudDb = postgres(cloudConnectionString, {
  ssl: {
    rejectUnauthorized: true, // Validate the server certificate
    ca: fs.readFileSync("./prod-ca-2021.crt").toString(), // Use the provided certificate
  },
});

// Local database connection (Docker)
const localDb = postgres({
  host: process.env.LOCAL_DB_HOST,
  port: process.env.LOCAL_DB_PORT,
  username: process.env.LOCAL_DB_USER,
  password: process.env.LOCAL_DB_PASSWORD,
  database: process.env.LOCAL_DB_NAME,
});

module.exports = { localDb, cloudDb };