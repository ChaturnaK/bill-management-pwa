// src/index.js
import React from "react";
import { createRoot } from "react-dom/client"; // Use createRoot from 'react-dom/client'
import "./index.css";
import App from "./App";
// If you're using serviceWorkerRegistration, import it. Otherwise, omit or comment out.
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const container = document.getElementById("root");
const root = createRoot(container); // createRoot instead of render

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);

// Register service worker for PWA capabilities if desired
serviceWorkerRegistration.register();
