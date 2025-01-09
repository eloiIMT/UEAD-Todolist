// src/controllers/lists.controller.ts

import { FastifyReply, FastifyRequest } from "fastify";
import { ITodoList, ITodoItem } from "../interfaces";

export async function listLists(_: FastifyRequest, reply: FastifyReply) {
  const client = await this.pg.connect();
  try {
    const { rows } = await client.query(
      "SELECT id, description, name, status FROM todo_lists",
    );

    const rowsWithItems = (await Promise.all(
      rows.map(async (row) => {
        const { rows: items } = await client.query(
          "SELECT id, description, status, user FROM todo_items WHERE list_id = $1",
          [row.id],
        );
        return {
          ...row,
          items,
        };
      }),
    )) satisfies ITodoList[];

    reply.send(rowsWithItems);
  } finally {
    client.release();
  }
}

export async function addLists(request: FastifyRequest, reply: FastifyReply) {
  const client = await this.pg.connect();
  const list = request.body as ITodoList;
  try {
    const { rows } = await client.query(
      "INSERT INTO todo_lists (id, description, name, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [list.id, list.description, list.name, list.status],
    );

    // add items to the list
    const items = list.items || [];
    const newList = {
      ...rows[0],
      items,
    } as ITodoList;

    reply.code(201).send(newList);
  } finally {
    client.release();
  }
}

export async function updateList(request: FastifyRequest, reply: FastifyReply) {
  const client = await this.pg.connect();
  const { id } = request.params as {
    id: string;
  };
  const updatedData = request.body as Partial<ITodoList>;

  try {
    const { rows } = await client.query(
      "UPDATE todo_lists SET description = $1, name = $2, status = $3 WHERE id = $4 RETURNING *",
      [updatedData.description, updatedData.name, updatedData.status, id],
    );

    const { rows: items } = await client.query(
      "SELECT id, description, status, user FROM todo_items WHERE list_id = $1",
      [id],
    );

    reply.send({
      ...rows[0],
      items,
    });
  } finally {
    client.release();
  }
}

export async function deleteList(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as {
    id: string;
  };

  const client = await this.pg.connect();
  try {
    await client.query("DELETE FROM todo_lists WHERE id = $1", [id]);

    reply.code(204).send();
  } finally {
    client.release();
  }
}

export async function addItemToList(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const client = await this.pg.connect();
  const { id } = request.params as {
    id: string;
  };
  const { id: itemId, description, status } = request.body as ITodoItem;
  try {
    await client.query(
      "INSERT INTO todo_items (id, description, status, list_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [itemId, description, status, id],
    );

    const { rows: list } = await client.query(
      "SELECT id, description, name, status FROM todo_lists WHERE id = $1",
      [id],
    );

    const { rows: items } = await client.query(
      "SELECT id, description, status, user FROM todo_items WHERE list_id = $1",
      [id],
    );

    const newList = {
      ...list[0],
      items,
    } as ITodoList;

    reply.code(201).send(newList);
  } finally {
    client.release();
  }
}

export async function removeItemFromList(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id, itemId } = request.params as {
    id: string;
    itemId: string;
  };

  const client = await this.pg.connect();
  try {
    reply.code(204).send();

    await client.query(
      "DELETE FROM todo_items WHERE id = $1 AND list_id = $2",
      [itemId, id],
    );
  } finally {
    client.release();
  }

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

  const client = await this.pg.connect();
  try {
    const { rows } = await client.query(
      "UPDATE todo_items SET description = $1, status = $2 WHERE id = $3 AND list_id = $4 RETURNING *",
      [updatedItem.description, updatedItem.status, itemId, id],
    );

    reply.send(rows[0]);
  } finally {
    client.release();
  }
}
