import { ITodoList, TodoListStatus } from "./api-types";
import { Def0, Def1StatusEnum, ListsApi, ItemsApi } from "todo-list-client";
import axios from "axios";

const listItems: Record<string, string[]> = {
  "Work Tasks": [
    "Buy groceries",
    "Complete React project",
    "Exercise for 30 minutes",
    "Read a book chapter",
  ],
  "Personal Tasks": [
    "Buy groceries",
    "Complete React project",
    "Exercise for 30 minutes",
    "Read a book chapter",
  ],
  "Shopping List": [
    "Buy groceries",
    "Complete React project",
    "Exercise for 30 minutes",
    "Read a book chapter",
  ],
};

const apiList = new ListsApi(
  {
    isJsonMime: (mime: string) => mime.startsWith("application/json"),
  },
  "http://localhost:3000",
  axios
);

const apiItem = new ItemsApi(
  {
    isJsonMime: (mime: string) => mime.startsWith("application/json"),
  },
  "http://localhost:3000",
  axios
);

export const apiClient = {
  getLists: async () => {
    const response = await apiList.listsGet();
    return response.data;
  },
  addList: async (listName: string) => {
    // const response = await api.listsPost({id: listName, name: listName})
    // console.debug('-- addList', listName, lists);

    const response = await apiList.listsPost({
      id: Date.now().toString(),
      name: listName,
      description: "A list of tasks",
      status: "PENDING",
      items: [],
    });
    console.debug("-- addList", response);
    return response.data;
  },
  getTodos: async (listId: string) => {
    const response = await apiList.listsGet();
    for (const list of response.data) {
      if (list.id === listId) {
        return list.items;
      }
    }
    // const response = await axios.get(
    //   `http://localhost:3000/lists/${listId}/items`
    // );
    return [];
  },
  addTodo: async (listId: string, todo: string) => {
    const newItem = {
      id: Date.now().toString(),
      list_id: listId,
      description: todo,
      status: Def1StatusEnum.Pending,
      user: undefined,
    };

    // Récupérer la liste actuelle
    const responseList = await apiList.listsGet();
    for (const list of responseList.data) {
      if (list.id === listId) {
        // Ajouter le nouvel item à la liste
        list.items.push(newItem);

        // Mettre à jour la liste avec le nouvel item
        const response = await apiItem.listsIdItemsPost(listId, newItem);
        return response.data;
      }
    }
    const response = await apiList.listsIdPut(listId);
    return response.data;
  },
};
