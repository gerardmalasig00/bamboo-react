import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {},
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: "1rem",
        },
      },
    },
  },
});
export default theme;
