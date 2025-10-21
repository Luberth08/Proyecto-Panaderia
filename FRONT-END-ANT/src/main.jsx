// src/main.js

import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./components/ThemeContext"; // Importa el ThemeProvider
import "./styles/login.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ThemeProvider>
    <App />
  </ThemeProvider>
  // </StrictMode>
);
