import fp from 'fastify-plugin';
import swagger, { FastifySwaggerOptions } from '@fastify/swagger';

export default fp<FastifySwaggerOptions>(async (fastify) => {
  fastify.register(swagger, {
    swagger: {
      info: { title: 'Todo API', version: '1.0.0' },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'todo', description: 'Todo related end-points' }
      ],
      definitions: {
        ITodoList: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            items: {
              type: 'array',
              items: { $ref: '#/definitions/ITodoItem' }
            },
            status: { type: 'string', enum: ['PENDING', 'IN-PROGRESS', 'DONE'] }
          }
        },
        ITodoItem: {
          type: 'object',
          required: ['id', 'description', 'status'],
          properties: {
            id: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['PENDING', 'IN-PROGRESS', 'DONE'] },
            assignedTo: { type: 'string' }
          }
        }
      }
    }
  });
});