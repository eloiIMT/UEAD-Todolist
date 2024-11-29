import { FastifyReply, FastifyRequest } from "fastify"
import { ITodoList } from "../interfaces"

const staticLists: ITodoList[] = [
  {
	id: 'l-1',
	description: 'Dev tasks',
  }
]

// export const listLists = async (
//  request: FastifyRequest, 
//  reply: FastifyReply) => {

//   Promise.resolve(staticLists)
//   .then((result) => {
// 	reply.send( result )
//   })
// }

export async function listLists(
    request: FastifyRequest, 
    reply: FastifyReply
  ) {
    console.log('DB status', this.level.listsdb.status)
    const listsIter = this.level.listsdb.iterator()
  
    const result: ITodoList[] = []
    for await (const [key, value] of listsIter) {
      result.push(JSON.parse(value))
    }
    reply.send(result)
  }

// export const addList = async (
//   request: FastifyRequest<{ Body: ITodoList }>, 
//   reply: FastifyReply
// ) => {
//   const newList = request.body;
//   staticLists.push(newList);
//   reply.code(201).send(newList);
// };

export async function addLists(
    request: FastifyRequest, 
    reply: FastifyReply
  ) {
   const list = request.body as ITodoList
   const result = await this.level.listsdb.put(
     list.id.toString(), JSON.stringify(list)
   )
   reply.send( result )
  }