import { Stack } from "@mui/material";
import TodoItem from "./TodoItem";
import { ITodo } from "../../types";

const Todos = ({ todos }: { todos: ITodo[] }) => {
  return (
    // TODO: Virtualize
    <Stack gap={2}>
      {todos.map((todo) => (
        <TodoItem {...todo} />
      ))}
    </Stack>
  );
};

export default Todos;
