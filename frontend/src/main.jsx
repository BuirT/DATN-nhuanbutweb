import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

(() => {
  const t = localStorage.getItem("theme") === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
})();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
