import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme/theme";
import AppRoutes from "./routes/AppRoute";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
