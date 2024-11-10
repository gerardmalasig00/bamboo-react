export interface ITodo {
  id?: number;
  title: string;
  description: string;
  status: "pending" | "completed" | "in progress";
  dueDate: string;
}

// Slice State
export interface ITodoState {
  todos: ITodo[];
}
