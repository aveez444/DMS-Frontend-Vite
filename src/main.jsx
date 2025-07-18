import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { FormDataProvider } from './components/AddvehicleComponent/FormDataContext'; // Import the FormDataProvider

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <FormDataProvider>
      <BrowserRouter>
      
        <App />
      </BrowserRouter>
    </FormDataProvider>  
  </AuthProvider>  
);
