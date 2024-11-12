import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NotificationProvider } from "./components/NotificationContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from "./components/UserContext";
import { BrowserRouter as Router } from "react-router-dom";
import { Table } from 'react-bootstrap';


const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <NotificationProvider>
        <Router>
          <App />
        </Router>
      </NotificationProvider>
    </UserProvider>
  </QueryClientProvider>
);