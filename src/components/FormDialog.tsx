import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface IFormDialogProps {
  open: boolean;
  title: string;
  subText?: string;
  submitText?: string;
  cancelText?: string;
  handleClose: () => void;
  handleSubmit: () => void;
  children: React.ReactNode;
}

const FormDialog = ({
  open,
  title,
  subText,
  submitText = "Submit",
  cancelText = "Cancel",
  handleClose,
  handleSubmit,
  children,
}: IFormDialogProps) => {
  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subText}</DialogContentText>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {children}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{cancelText}</Button>
        <Button onClick={handleSubmit} variant="contained">
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
