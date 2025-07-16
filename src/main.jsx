import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./Providers/Authentication/AuthProvider.jsx";
import { RouterProvider } from "react-router";
import { router } from "./Routers/Router.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./Components/ui/sonner.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster position="top-center" richColors expand={true} />
          <RouterProvider router={router}></RouterProvider>
        </AuthProvider>
      </QueryClientProvider>
  </StrictMode>
);
