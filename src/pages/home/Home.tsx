import {
  Typography,
  Container,
  Box,
  Stack,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import EmptyTodos from "./EmptyTodos";
import AddTodoDialog from "./AddTodoDialog";
import { memo, useCallback, useMemo, useState } from "react";
import { addTodo } from "../../store/slices/todoSlice";
import { ITodo } from "../../types";
import Todos from "./Todos";
import SearchInput from "../../components/SearchInput";
import { Add } from "@mui/icons-material";
import { todoStatuses } from "../../utils/constants";

export type TodoStatus = (typeof todoStatuses)[number];

const statuses = [
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "In Progress",
    value: "in progress",
  },
];

const Home = memo(() => {
  const dispatch = useDispatch();
  const todosReducer = useSelector((state: RootState) => state.todo.todos);

  const [todoInput, setTodoInput] = useState<ITodo>({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });
  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TodoStatus>("all");

  const todos = useMemo(() => {
    if (search) {
      const regex = new RegExp(search.split("").join(".*?"), "i");
      return todosReducer.filter((todo) => regex.test(todo.title));
    }
    return status === "all"
      ? todosReducer
      : todosReducer.filter((todo) => todo.status === status);
  }, [todosReducer, search, status]);

  const handleOpen = () => setOpenDialog(true);

  const handleClose = () => setOpenDialog(false);

  // Simple Validation
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!todoInput.title) errors.title = "Title is required";
    if (!todoInput.description) errors.description = "Description is required";
    if (!todoInput.dueDate) errors.dueDate = "Due Date is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }, [todoInput]);

  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      dispatch(addTodo(todoInput));
      setOpenDialog(false);
    }
  }, [dispatch, todoInput, validateForm]);

  const handleFieldUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<TodoStatus>) => {
    setStatus(event.target.value as TodoStatus);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "grid",
        placeItems: "center",
        gap: 4,
      }}
    >
      <Typography component={"h1"} variant="h4">
        My Todo List
      </Typography>
      <Stack
        width={"100%"}
        gap={1}
        display={"flex"}
        direction={"row"}
        alignItems={"flex-start"}
      >
        <SearchInput
          setParams={setSearch}
          totalItems={todos}
          isLoading={loading}
          setIsLoading={setLoading}
        />
        <Select
          data-testid="status-filter"
          labelId="select-label"
          value={status}
          onChange={handleStatusFilterChange}
          size="small"
          sx={{
            width: "120px",
          }}
        >
          <MenuItem
            value={"all"}
            sx={{
              textTransform: "capitalize",
            }}
          >
            All
          </MenuItem>
          {statuses.map((stat) => (
            <MenuItem
              key={stat.value}
              value={stat.value}
              sx={{
                textTransform: "capitalize",
              }}
            >
              {stat.label}
            </MenuItem>
          ))}
        </Select>
        <Button onClick={handleOpen} variant="contained" startIcon={<Add />}>
          Add
        </Button>
      </Stack>

      <Box width={"100%"}>
        {todos.length === 0 && !search && status === "all" ? (
          <EmptyTodos handleOpen={handleOpen} />
        ) : (
          <Todos todos={todos} />
        )}
      </Box>

      {/* Form Dialog Placement */}
      <AddTodoDialog
        open={openDialog}
        handleFieldUpdate={handleFieldUpdate}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        errors={errors}
      />
    </Container>
  );
});

export default Home;
