// routes/lists/index.ts

import { FastifyInstance } from 'fastify'
import * as listsController from '../../controllers/lists.controller'

async function lists(fastify: FastifyInstance) {

  fastify.get('/', listsController.listLists)

  // TODO implement addList in controller
  fastify.post('/', listsController.addLists)

}

export default lists