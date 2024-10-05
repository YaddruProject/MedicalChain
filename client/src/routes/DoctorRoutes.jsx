import { Route, Routes } from 'react-router-dom';

import Profile from '../pages/Doctor/Profile';
import RegisterPatient from '../pages/Doctor/RegisterPatient';
import Patients from '../pages/Doctor/Patients';

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<Profile />} />
      <Route path="profile" element={<Profile />} />
      <Route path="register-patient" element={<RegisterPatient />} />
      <Route path="patients" element={<Patients />} />
    </Routes>
  );
};

export default DoctorRoutes;
