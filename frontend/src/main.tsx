import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/style.css";
import App from "./App/App";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter basename="/DevPulse/">
            <QueryClientProvider client={client}>
                <App />
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
);
