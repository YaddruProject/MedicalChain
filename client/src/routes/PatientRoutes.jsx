import { Route, Routes } from 'react-router-dom';

import PatientProfile from '@pages/Patient/Profile';
import PatientRecords from '@pages/Patient/Records';
import Doctors from '@pages/Patient/Doctors';
import ProtectedRoute from './ProtectedRoute';

const PatientRoutes = () => {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path='' element={<PatientProfile />} />
        <Route path='profile' element={<PatientProfile />} />
        <Route path='records' element={<PatientRecords />} />
        <Route path='doctors' element={<Doctors />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default PatientRoutes;
