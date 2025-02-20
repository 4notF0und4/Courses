import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, IconButton } from "@mui/material";
import { Brightness7, Brightness4 } from "@mui/icons-material";
import { useThemeContext } from "./ThemeContext";
import Login from "./Login";
import Courses from "./Courses";
import { ThemeProviderComponent } from "./ThemeContext";

const App: React.FC = () => {
  const { toggleTheme, mode } = useThemeContext();

  return (
    <Router>
      <Container sx={{ py: 2 }}>
        <IconButton
          onClick={toggleTheme}
          sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}
        >
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/courses" element={<Courses />} />
        </Routes>
      </Container>
    </Router>
  );
};

const WrappedApp: React.FC = () => {
  return (
    <ThemeProviderComponent>
      <App />
    </ThemeProviderComponent>
  );
};
export default WrappedApp;
