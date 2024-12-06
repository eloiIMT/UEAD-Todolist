// interfaces/index.ts

export interface ITodoList {
  id: string;
  description: string;
  name: string;
  items: ITodoItem[];
  status: "PENDING" | "IN-PROGRESS" | "DONE";
}

export interface ITodoItem {
  id: string;
  description: string;
  status: "PENDING" | "IN-PROGRESS" | "DONE";
  user?: string;
}
