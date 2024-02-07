import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ErrorResponse, errorResponse, Fragrance } from "@repo/types";

export const fragrance = async (fastify: FastifyInstance) => {
  // GET all fragrances
  fastify.get<{ Reply: Fragrance.FragranceTransport[] | ErrorResponse }>(
    "/fragrance",
    {
      schema: { response: { 200: z.array(Fragrance.fragranceTransport) } },
    },
    async (request, reply) => {
      try {
        const { rows } = await fastify.pg.query<Fragrance.FragranceTransport>(
          "SELECT * FROM fragrance"
        );

        const transport: Fragrance.FragranceTransport[] = rows.map(
          (row: Fragrance.FragranceTransport) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            category: row.category,
            image_url: row.image_url,
            created_at: row.created_at,
            updated_at: row.updated_at,
          })
        );

        return transport;
      } catch (error: any) {
        console.log("error", error);
        reply.send({
          statusCode: 500,
          error: "Internal Server Error",
          message: error.toString(),
        });
      }
    }
  );

  // GET a single fragrance
  fastify.get<{
    Params: { id: string };
    Reply: Fragrance.FragranceTransport | ErrorResponse;
  }>(
    "/fragrance/:id",
    {
      schema: {
        params: z.object({ id: z.string() }),
        response: {
          200: Fragrance.fragranceTransport,
          500: errorResponse,
          404: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      try {
        const { rows } = await fastify.pg.query<Fragrance.FragranceTransport>(
          "SELECT * FROM fragrance WHERE id = $1",
          [id]
        );

        if (rows.length === 0) {
          reply.code(404).send({
            statusCode: 404,
            error: "Not Found",
            message: "Fragrance not found",
          });
        }

        const [result] = rows;

        const transport: Fragrance.FragranceTransport = {
          id: result.id,
          name: result.name,
          description: result.description,
          category: result.category,
          image_url: result.image_url,
          created_at: result.created_at,
          updated_at: result.updated_at,
        };

        return transport;
      } catch (error: any) {
        reply.send({
          statusCode: 500,
          error: "Internal Server Error",
          message: error.toString(),
        });
      }
    }
  );

  // POST a new fragrance
  fastify.post<{
    Body: Fragrance.FragranceCreateTransport;
    Reply: Fragrance.FragranceTransport | ErrorResponse;
  }>(
    "/fragrance",
    {
      schema: {
        body: Fragrance.fragranceCreateTransport,
        response: { 201: Fragrance.fragranceTransport, 500: errorResponse },
      },
    },
    async (request, reply) => {
      const { name, description, category, image_url } = request.body;

      try {
        const { rows } = await fastify.pg.query(
          "INSERT INTO fragrance (name, description, category, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
          [name, description, category, image_url]
        );

        const [result] = rows;

        const transport: Fragrance.FragranceTransport = {
          id: result.id,
          name: result.name,
          description: result.description,
          category: result.category,
          image_url: result.image_url,
          created_at: result.created_at,
          updated_at: result.updated_at,
        };
        reply.code(201).send(transport);
      } catch (error: any) {
        const errorResponse: ErrorResponse = {
          statusCode: 500,
          error: "Internal Server Error",
          message: error.toString(),
        };

        reply.send(errorResponse);
      }
    }
  );

  // POST multiple new fragrances
  fastify.post<{
    Body: Fragrance.FragranceCreateTransport[];
    Reply: Fragrance.FragranceTransport[] | ErrorResponse;
  }>(
    "/fragrance/bulk",
    {
      schema: {
        body: z.array(Fragrance.fragranceCreateTransport),
        response: {
          201: z.array(Fragrance.fragranceTransport),
          500: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const fragrances = request.body;

      try {
        const results: Fragrance.FragranceTransport[] = [];

        await fastify.pg.query("BEGIN"); // Start the transaction

        for (const fragrance of fragrances) {
          const { name, description, category, image_url } = fragrance;

          const { rows } = await fastify.pg.query(
            "INSERT INTO fragrance (name, description, category, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, description, category, image_url]
          );

          const [result] = rows;

          const transport: Fragrance.FragranceTransport = {
            id: result.id,
            name: result.name,
            description: result.description,
            category: result.category,
            image_url: result.image_url,
            created_at: result.created_at,
            updated_at: result.updated_at,
          };

          results.push(transport);
        }

        await fastify.pg.query("COMMIT");
        reply.code(201).send(results);
      } catch (error: any) {
        await fastify.pg.query("ROLLBACK");
        const errorResponse: ErrorResponse = {
          statusCode: 500,
          error: "Internal Server Error",
          message: error.toString(),
        };

        reply.send(errorResponse);
      }
    }
  );

  // PUT a fragrence
  fastify.put<{
    Params: { id: string };
    Body: Fragrance.FragranceCreateTransport;
    Reply: Fragrance.FragranceTransport | ErrorResponse;
  }>(
    "/fragrance/:id",
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: Fragrance.fragranceCreateTransport,
        response: { 200: Fragrance.fragranceTransport, 500: errorResponse },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name, description, category, image_url } = request.body;

      console.log("PUT /fragrance", request.body);

      try {
        const result2 = await fastify.pg.query(
          `UPDATE fragrance SET name = $1, description = $2, category = $3, "updated_at" = now(),  image_url = $4 WHERE id = $5 RETURNING *`,
          [name, description, category, image_url, id]
        );

        console.log("result2", result2);

        if (result2.rowCount === 0) {
          reply.code(404).send({
            statusCode: 404,
            error: "Not Found",
            message: "Fragrance not found",
          });
        }

        const [result] = result2.rows;

        const transport: Fragrance.FragranceTransport = {
          id: result.id,
          name: result.name,
          description: result.description,
          category: result.category,
          image_url: result.image_url,
          created_at: result.created_at,
          updated_at: result.updated_at,
        };

        reply.code(200).send(transport);
      } catch (error: any) {
        reply.send({
          statusCode: 500,
          error: "Internal Server Error",
          message: error.toString(),
        });
      }
    }
  );

  // DELETE a fragrance
  fastify.delete<{
    Params: { id: string };
    Reply: ErrorResponse;
  }>(
    "/fragrance/:id",
    {
      schema: {
        params: z.object({ id: z.string() }),
        response: { 204: errorResponse, 500: errorResponse },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      console.log("DELETE /fragrance", request.params);

      try {
        const { rowCount } = await fastify.pg.query(
          "DELETE FROM fragrance WHERE id = $1",
          [id]
        );

        if (rowCount === 0) {
          reply.code(404).send({
            statusCode: 404,
            error: "Not Found",
            message: "Fragrance not found",
          });
        }

        reply.code(200).send();
      } catch (error: any) {
        console.log("error", error);
        reply.send({
          statusCode: 500,
          error: "Internal Server Error",
          message: error.toString(),
        });
      }
    }
  );
};
