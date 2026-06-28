import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

// Em dev, desregistra service workers antigos para evitar que sirvam assets cacheados
if (import.meta.env.DEV && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((r) => r.unregister());
  });
}

const root = document.getElementById("sidebar-root");
if (root) {
  createRoot(root).render(<App />);
}
