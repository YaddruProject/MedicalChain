import { Route, Routes, Navigate } from 'react-router-dom';

import useIsLoggedIn from './hooks/useIsLoggedIn';
import useUser from './hooks/useUser';

import HomePage from './pages/Home/HomePage';
import MainLayout from './components/MainLayout';

import AdminRoutes from './routes/AdminRoutes';
import DoctorRoutes from './routes/DoctorRoutes';
import PatientRoutes from './routes/PatientRoutes';

function App() {
  const isLoggedIn = useIsLoggedIn();
  const user = useUser();

  const renderDashboards = () => {
    if (!isLoggedIn) {
      return <Navigate to="/" />
    }
    switch (Number(user.role)) {
      case 1:
        return <AdminRoutes />
      case 2:
        return <DoctorRoutes />
      case 3:
        return <PatientRoutes />
      default:
        return <Navigate to="/" />
    }
  }

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/dashboard/*' element={<MainLayout />}>
        <Route path='*' element={renderDashboards()} />
      </Route>
    </Routes>
  )
}

export default App;
