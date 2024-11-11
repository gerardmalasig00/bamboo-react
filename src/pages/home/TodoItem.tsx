import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ITodo } from "../../types";
import { useDispatch } from "react-redux";
import { useState } from "react";
import MorePopover from "../../components/MorePopOver";
import { editTodo, removeTodo } from "../../store/slices/todoSlice";

const statuses = {
  pending: {
    label: "Pending",
    color: "FFA500",
  },
  completed: {
    label: "Completed",
    color: "4CAF50",
  },
  "in progress": {
    label: "In Progress",
    color: "2196F3",
  },
};

const defaultError = {
  title: "",
  description: "",
  dueDate: "",
};

const TodoItem = (props: ITodo) => {
  const { id, title, description, status, dueDate } = props;

  const dispatch = useDispatch();

  const [todoInput, setTodoInput] = useState<ITodo>({
    title: title,
    description: description,
    status: status,
    dueDate: dueDate,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState(defaultError);
  const handleEdit = () => {
    setIsEditing(true);
  };
  const cancelEdit = () => setIsEditing(false);

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
    setErrors(defaultError);
    if (!validateForm()) return;
    dispatch(editTodo({ id, ...todoInput }));
    setIsEditing(false);
  };

  const handleFieldUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDelete = () => {
    dispatch(removeTodo(id!));
  };

  const handleSelectChange = (
    event: SelectChangeEvent<"pending" | "completed" | "in progress">
  ) => {
    const value = event.target.value as keyof typeof statuses;
    if (!Object.keys(statuses).includes(value)) return;
    setTodoInput((prev) => ({ ...prev, status: value }));
    dispatch(editTodo({ id, ...todoInput, status: value }));
  };

  return (
    <Stack
      data-testid={`todo-${id}-${title}`}
      mb={2}
      padding={2}
      border={1}
      borderRadius={2}
      borderColor="grey"
      gap={2}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          {isEditing ? (
            <TextField
              name="title"
              onChange={handleFieldUpdate}
              label="Title"
              value={todoInput.title}
              required
              error={!!errors.title}
              helperText={errors?.title}
            />
          ) : (
            <Typography component={"h3"} variant="h5" fontWeight={"bold"}>
              {title}
            </Typography>
          )}
        </Box>
        <Box
          flex={1}
          maxWidth="max-content"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isEditing ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              <Button onClick={handleSubmit} size="small" variant="contained">
                Apply
              </Button>
              <Button onClick={cancelEdit} size="small">
                Cancel
              </Button>
            </Box>
          ) : (
            <Select
              labelId="select-label"
              value={todoInput.status}
              onChange={handleSelectChange}
              size="small"
              sx={{
                color:
                  "#" +
                  statuses[todoInput.status as keyof typeof statuses].color,
              }}
            >
              {Object.keys(statuses).map((status) => {
                const stat = statuses[status as keyof typeof statuses];
                return (
                  <MenuItem
                    key={status}
                    value={status}
                    sx={{
                      textTransform: "capitalize",
                      color: `#${stat.color}`,
                    }}
                  >
                    {stat.label}
                  </MenuItem>
                );
              })}
            </Select>
          )}

          <MorePopover handleDelete={handleDelete} handleEdit={handleEdit} />
        </Box>
      </Box>
      {isEditing ? (
        <>
          <TextField
            name="description"
            onChange={handleFieldUpdate}
            label="Description"
            value={todoInput.description}
            required
            error={!!errors.description}
            helperText={errors?.description}
          />
          <TextField
            name="dueDate"
            onChange={handleFieldUpdate}
            value={todoInput.dueDate}
            type="date"
            label="Due Date"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            required
            error={!!errors.dueDate}
            helperText={errors?.dueDate}
          />
        </>
      ) : (
        <>
          <Typography variant="body2">{description}</Typography>
          <Typography variant="caption">{dueDate}</Typography>
        </>
      )}
    </Stack>
  );
};

export default TodoItem;
