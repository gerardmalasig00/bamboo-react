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
import { useEffect, useState } from "react";
import { addTodo } from "../../store/slices/todoSlice";
import { ITodo } from "../../types";
import Todos from "./Todos";
import SearchInput from "../../components/SearchInput";
import { Add } from "@mui/icons-material";

export const todoStatuses = [
  "all",
  "pending",
  "completed",
  "in progress",
] as const;
export type TodoStatus = (typeof todoStatuses)[number];

const Home = () => {
  const dispatch = useDispatch();
  const todosReducer = useSelector((state: RootState) => state.todo.todos);

  const [todos, setTodos] = useState<ITodo[]>([]);
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
  const handleOpen = () => setOpenDialog(true);

  const handleClose = () => setOpenDialog(false);

  // Simple Validation
  const validateForm = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors: any = {};
    if (!todoInput.title) {
      errors.title = "Title is required";
    }
    if (!todoInput.description) {
      errors.description = "Description is required";
    }
    if (!todoInput.dueDate) {
      errors.dueDate = "Due Date is required";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    setErrors({});
    if (!validateForm()) return;
    dispatch(addTodo(todoInput));
    setOpenDialog(false);
  };

  const handleFieldUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleStatusFilterChange = (event: SelectChangeEvent<TodoStatus>) => {
    const value = event.target.value as TodoStatus;
    if (value === "all") {
      setTodos(todosReducer);
    } else {
      setTodos((prev) => prev.filter((todo) => todo.status === value));
    }
    setStatus(value);
  };

  useEffect(() => {
    console.log(search, "search");
    if (search) {
      const regex = new RegExp(search.split("").join(".*?"), "i"); // Create a regex for "almost exact match" (case-insensitive)
      setTodos(todosReducer.filter((todo) => regex.test(todo.title))); // Filter todos by regex match
    } else {
      setTodos(todosReducer); // Reset todos to the original list if search is empty
    }
  }, [search]);

  useEffect(() => {
    setTodos(todosReducer);
  }, [todosReducer]);

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
        {todos.length === 0 && !search ? (
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
};

export default Home;
