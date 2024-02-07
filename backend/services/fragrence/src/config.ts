import convict from "convict";
import dotenv from "dotenv";

dotenv.config(); // root src directory

const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 5000,
    env: "PORT",
  },
  host: {
    doc: "The host to bind.",
    format: "*",
    default: "http://127.0.0.1",
    env: "HOST",
  },
  dbUrl: {
    doc: "The URL of the Postgres DB.",
    format: "*",
    default: "postgres://localhost:5432/fragrance",
    env: "DATABASE_URL",
  },
});

// Load environment variables into convict
const dbUser = process.env.DB_USER ? process.env.DB_USER : "admin";
const dbPassword = process.env.DB_PASSWORD
  ? process.env.DB_PASSWORD
  : "password";
const dbHost = process.env.DB_HOST ? process.env.DB_HOST : "localhost";
const dbPort = process.env.DB_PORT ? process.env.DB_PORT : "5432";

config.load({
  env: process.env.NODE_ENV ? process.env.NODE_ENV : "development",
  port: process.env.PORT ? process.env.PORT : 5000,
  host: process.env.HOST ? process.env.HOST : "http://127.0.0.1",
  dbUrl: `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/fragrance`,
});

// Perform validation
config.validate({ allowed: "strict" });

export default config;
