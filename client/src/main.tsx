import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Dashboard } from "./Dashboard.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StrictMode>
      <Dashboard />
    </StrictMode>
  </Provider>
);
