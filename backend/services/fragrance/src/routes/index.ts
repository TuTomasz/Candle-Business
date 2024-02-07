import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { healthCheck } from "./health-check";
import { fragrance } from "./fragrance";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function setupRoutes(
  fastifyInstance: FastifyInstance
): Promise<void> {
  [healthCheck, fragrance].forEach((routeDefinition: FastifyPluginAsync) => {
    fastifyInstance
      .withTypeProvider<ZodTypeProvider>()
      .register(routeDefinition);
  });
}
