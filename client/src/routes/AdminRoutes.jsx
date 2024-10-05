import { Route, Routes } from 'react-router-dom';

import Profile from '../pages/Admin/Profile';
import RegisterDoctor from '../pages/Admin/RegisterDoctor';
import Users from '../pages/Admin/Users';
import Performance from '../pages/Admin/Performance';
import Logs from '../pages/Admin/Logs';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path='' element={<Profile />} />
            <Route path='profile' element={<Profile />} />
            <Route path='users' element={<Users />} />
            <Route path='register-doctor' element={<RegisterDoctor />} />
            <Route path='performance' element={<Performance />} />
            <Route path='logs' element={<Logs />} />
        </Routes>
    );
}

export default AdminRoutes;
