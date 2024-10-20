import { Route, Routes, Navigate } from 'react-router-dom';

import HomePage from '@pages/Home/HomePage';
import AuthRoute from '@routes/AuthRoute';

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/dashboard/*' element={<AuthRoute />} />
      <Route path='*' element={<Navigate to='/' replace={true} />} />
    </Routes>
  )
}

export default App;
