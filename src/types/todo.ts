export interface ITodo {
  id?: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "in progress";
  dueDate: string;
}

// Slice State
export interface ITodoState {
  todos: ITodo[];
}
