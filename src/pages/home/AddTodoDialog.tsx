import { TextField } from "@mui/material";
import FormDialog from "../../components/FormDialog";

interface AddTodoDialogProps {
  open: boolean;
  handleFieldUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClose: () => void;
  handleSubmit: () => void;
  errors: { [key: string]: string };
}
const AddTodoDialog = ({
  open,
  handleFieldUpdate,
  handleClose,
  handleSubmit,
  errors,
}: AddTodoDialogProps) => {
  return (
    <FormDialog
      title="Add Todo"
      open={open}
      handleClose={handleClose}
      handleSubmit={handleSubmit}
    >
      <TextField
        name="title"
        onChange={handleFieldUpdate}
        label="Title"
        required
        error={!!errors.title}
        helperText={errors?.title}
      />
      <TextField
        name="description"
        onChange={handleFieldUpdate}
        label="Description"
        required
        error={!!errors.description}
        helperText={errors?.description}
      />
      <TextField
        name="dueDate"
        onChange={handleFieldUpdate}
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
    </FormDialog>
  );
};

export default AddTodoDialog;
