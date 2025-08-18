// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // Your root App component
import './index.css'; // Global CSS for your application

/**
 * The main entry point of the SportZen React application.
 * It renders the App component into the DOM.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);