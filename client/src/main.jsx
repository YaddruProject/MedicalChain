import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import { ContractProvider } from './context/ContractContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContractProvider>
      <App />
    </ContractProvider>
  </StrictMode>,
)
