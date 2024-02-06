import { FastifyInstance } from "fastify";

// CHECK HEALTH OF THE SERVICE
export const healthCheck = async (fastify: FastifyInstance) => {
  fastify.get(
    "/fragrance/health-check",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string" },
            },
          },
        },
      },
    },
    async () => {
      return { status: "ok" };
    }
  );
};
