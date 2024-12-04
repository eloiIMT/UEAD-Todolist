// src/controllers/lists.controller.ts

import { FastifyReply, FastifyRequest } from "fastify";
import { ITodoList, ITodoItem } from "../interfaces";

export async function listLists(request: FastifyRequest, reply: FastifyReply) {
  console.log("DB status", this.level.listsdb.status);
  const listsIter = this.level.listsdb.iterator();

  const result: ITodoList[] = [];
  for await (const [key, value] of listsIter) {
    result.push(JSON.parse(value));
  }
  reply.send(result);
}

export async function addLists(request: FastifyRequest, reply: FastifyReply) {
  const list = request.body as ITodoList;
  await this.level.listsdb.put(list.id, JSON.stringify(list));

  reply.code(201).send(list);
}

export async function updateList(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as {
    id: string;
  };
  const updatedData = request.body as Partial<ITodoList>;
  const list = JSON.parse(await this.level.listsdb.get(id)) as ITodoList;
  Object.assign(list, updatedData);
  await this.level.listsdb.put(id, JSON.stringify(list));

  reply.send(list);
}

export async function addItemToList(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as {
    id: string;
  };
  const item = request.body as ITodoItem;
  const list = JSON.parse(await this.level.listsdb.get(id)) as ITodoList;
  list.items = list.items || [];
  list.items.push(item);
  await this.level.listsdb.put(id, JSON.stringify(list));

  reply.code(201).send(item);
}

export async function removeItemFromList(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id, itemId } = request.params as {
    id: string;
    itemId: string;
  };
  const list = JSON.parse(await this.level.listsdb.get(id)) as ITodoList;
  list.items = list.items?.filter((item) => item.id !== itemId);
  await this.level.listsdb.put(id, JSON.stringify(list));

  reply.code(204).send();
}

export async function updateItemInList(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id, itemId } = request.params as {
    id: string;
    itemId: string;
  };
  const updatedItem = request.body as Partial<ITodoItem>;
  const list = JSON.parse(await this.level.listsdb.get(id)) as ITodoList;
  const itemIndex = list.items?.findIndex((item) => item.id === itemId);

  if (itemIndex !== undefined && itemIndex >= 0) {
    Object.assign(list.items[itemIndex], updatedItem);
    await this.level.listsdb.put(id, JSON.stringify(list));

    reply.send(list.items[itemIndex]);
  } else {
    reply.code(404).send({ error: "Item not found" });
  }
}
