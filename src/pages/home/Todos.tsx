import TodoItem from "./TodoItem";
import { ITodo } from "../../types";
import {
  VariableSizeList as List,
  ListChildComponentProps,
} from "react-window";
import { memo, useCallback } from "react";

const Todos = memo(({ todos }: { todos: ITodo[] }) => {
  const getRowHeight = useCallback((): number => {
    return 200;
  }, [todos]);
  const Row = ({ index, style }: ListChildComponentProps) => {
    return (
      <div
        style={{
          ...style, // Apply the default style from react-window
        }}
      >
        <TodoItem {...todos[index]} />
      </div>
    );
  };

  return (
    <List
      height={600}
      itemCount={todos.length}
      itemSize={getRowHeight}
      width={"100%"}
    >
      {Row}
    </List>
  );
});

export default Todos;
