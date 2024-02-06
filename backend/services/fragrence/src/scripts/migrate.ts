// migrate.ts
import run from "node-pg-migrate";
import config from "../config";

const main = async () => {
  const direction = process.argv[2] === "up" ? "up" : "down";
  console.log(`Running migrations in ${direction} direction`);
  console.log(`dbUrl: ${config.get("dbUrl")}`);

  try {
    await run({
      dir: "migrations", // specify your migrations directory
      migrationsTable: "migrations",
      direction: direction,
      migrationsSchema: "public",
      count: undefined,
      noLock: false,
      databaseUrl: config.get("dbUrl"),
      createMigrationsSchema: true,
    });
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }
};

main();
