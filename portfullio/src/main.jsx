// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";

// Remove "import UserForm" because we're not using it here.

const clientID =
  "140496072431-r1ag5b6sgd4v4tjfceg7h7gh7nj3bkk0.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
