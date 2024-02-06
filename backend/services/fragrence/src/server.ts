import Fastify from "fastify";
import config from "./config";
import { setupRoutes } from "./routes/index";
import { fastifyPostgres } from "@fastify/postgres";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

const fastify = Fastify({
  logger: true,
});

// Add schema validator and serializer
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

const initialize = async () => {
  // Register cors
  fastify.register(cors, {
    origin: "*",
  });

  //Connect to Postgres DB
  await fastify.register(fastifyPostgres, {
    connectionString: config.get("dbUrl"),
  });

  // check if the connection is successful
  try {
    const res = await fastify.pg.query("SELECT NOW()");
    console.log("Succesfuly conected to DB", res.rows[0]);
  } catch (error) {
    console.log("error", error);
  }

  // Register routes
  await setupRoutes(fastify);

  // Run the server!
  try {
    await fastify.listen({
      port: config.get("port"),
      // host: "0.0.0.0",
    });
    console.log("Server is running on port:", config.get("port"));
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
initialize();
