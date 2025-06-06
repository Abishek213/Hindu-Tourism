// main.jsx or index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/themeContext';
import { SidebarProvider } from './context/sidebarContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <SidebarProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </SidebarProvider>
    </ThemeProvider>
  </React.StrictMode>
);