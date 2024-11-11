import TodoItem from "./TodoItem";
import { ITodo } from "../../types";
// import {
//   VariableSizeList as List,
//   ListChildComponentProps,
// } from "react-window";
import { memo } from "react";
import { Stack } from "@mui/material";

const Todos = memo(({ todos }: { todos: ITodo[] }) => {
  // There's an issue with react-window default styling
  // const getRowHeight = useCallback((): number => {
  //   return 200;
  // }, []);
  // const Row = ({ index, style }: ListChildComponentProps) => {
  //   return (
  //     <div
  //       style={{
  //         ...style, // Apply the default style from react-window
  //       }}
  //     >
  //       <TodoItem {...todos[index]} />
  //     </div>
  //   );
  // };

  return (
    // <List
    //   height={600}
    //   itemCount={todos.length}
    //   itemSize={getRowHeight}
    //   width={"100%"}
    // >
    //   {Row}
    // </List>

    <Stack data-testid="todo-list" gap={2}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} {...todo} />
      ))}
    </Stack>
  );
});

export default Todos;
