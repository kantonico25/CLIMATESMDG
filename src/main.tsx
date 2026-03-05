import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./Components/App";

const container = document.getElementById("app");

if (container && container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else if (container) {
  createRoot(container).render(<App />);
}
