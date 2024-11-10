import { Box, Button, Typography } from "@mui/material";

const EmptyTodos = ({ handleOpen }: { handleOpen: () => void }) => {
  return (
    <Box
      padding={4}
      borderRadius={2}
      sx={{
        display: "grid",
        placeItems: "center",
        border: (theme) => `2px dashed ${theme.palette.primary.main}`,
      }}
    >
      <Typography mb={2}>No todos found</Typography>
      <Button variant="contained" onClick={handleOpen}>
        Add Todo
      </Button>
    </Box>
  );
};

export default EmptyTodos;
