import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import useIsLoggedIn from '../hooks/useIsLoggedIn';
import useUser from '../hooks/useUser';

import MainLayout from '../components/MainLayout';

import AdminRoutes from '../routes/AdminRoutes';
import DoctorRoutes from '../routes/DoctorRoutes';
import PatientRoutes from '../routes/PatientRoutes';

function AuthRoute() {
    const isLoggedIn = useIsLoggedIn();
    const user = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/', { replace: true });
        }
        else {
            setLoading(false);
        }
    }, [isLoggedIn, navigate]);

    const renderDashboards = () => {
        if (!user) {
            return null;
        }
        switch (Number(user.role)) {
            case 1:
                return <AdminRoutes />
            case 2:
                return <DoctorRoutes />
            case 3:
                return <PatientRoutes />
            default:
                return <div>Invalid Role</div>;
        }
    }

    if (loading) {
        return null;
    }

    return (
        <Routes>
            <Route path='/*' element={<MainLayout />}>
                <Route path='*' element={renderDashboards()} />
            </Route>
        </Routes>
    )
}

export default AuthRoute;
