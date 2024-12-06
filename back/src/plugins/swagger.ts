// src/plugins/swagger.ts

import fp from "fastify-plugin";
import swagger, { FastifySwaggerOptions } from "@fastify/swagger";
import SwaggerUI from "@fastify/swagger-ui";

import JsonSchemas from "../schemas/all.json";

export default fp<FastifySwaggerOptions>(async (fastify) => {
  fastify.addSchema({
    $id: "ITodoList",
    ...JsonSchemas.definitions.ITodoList,
  });
  fastify.addSchema({
    $id: "ITodoItem",
    ...JsonSchemas.definitions.ITodoItem,
  });
  fastify.register(swagger, {
    swagger: {
      info: { title: "Todo API", version: "1.0.0" },
      host: "localhost:3000",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
  });
});
