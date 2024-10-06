import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './styles/global.css';
import './styles/responsive.css';

import App from './App.jsx';
import { ContractProvider } from './context/ContractContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ContractProvider>
        <App />
      </ContractProvider>
    </BrowserRouter>
  </StrictMode>,
)
