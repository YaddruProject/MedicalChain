import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { Spin, Result, Button, message } from 'antd';

import useContract from '@hooks/useContract';
import useUser from '@hooks/useUser';
import FacialRecognition from '@components/FacialRecognition';
import { authenticateWithBiometrics } from '@utils/biometricsUtils';

const ProtectedRoute = ({ children }) => {
    const contract = useContract();
    const user = useUser();
    const [authState, setAuthState] = useState({
        isLoading: true,
        isAuthenticated: false,
        showFacialAuth: false,
        authError: false,
    });

    const checkBiometricAuth = useCallback(async () => {
        // Only check biometrics for doctors and patients
        if (![2, 3].includes(Number(user.role))) {
            setAuthState({
                isLoading: false,
                isAuthenticated: true,
                showFacialAuth: false,
                authError: false,
            });
            return;
        }

        try {
            const biometricsCID = await contract.getBiometrics();
            
            if (!biometricsCID) {
                // No biometrics set up yet - should not happen if setup is enforced
                setAuthState({
                    isLoading: false,
                    isAuthenticated: false,
                    showFacialAuth: false,
                    authError: true,
                });
                return;
            }

            // Check if already authenticated in this session
            // const sessionAuth = sessionStorage.getItem(`biometric_auth_${user.address}`);
            // if (sessionAuth === 'true') {
            //     setAuthState({
            //         isLoading: false,
            //         isAuthenticated: true,
            //         showFacialAuth: false,
            //         authError: false,
            //     });
            //     return;
            // }

            // Need to authenticate with facial recognition
            setAuthState({
                isLoading: false,
                isAuthenticated: false,
                showFacialAuth: true,
                authError: false,
            });
        } catch (error) {
            console.error('Error checking biometric authentication:', error);
            setAuthState({
                isLoading: false,
                isAuthenticated: false,
                showFacialAuth: false,
                authError: true,
            });
        }
    }, [contract, user.role, user.address]);

    useEffect(() => {
        if (contract && user.address && user.role) {
            checkBiometricAuth();
        }
    }, [contract, user.address, user.role, checkBiometricAuth]);

    const handleFacialAuth = async (capturedImage) => {
        try {
            const biometricsCID = await contract.getBiometrics();
            const isAuthenticated = await authenticateWithBiometrics(biometricsCID, capturedImage);

            if (isAuthenticated) {
                // Store authentication in session
                sessionStorage.setItem(`biometric_auth_${user.address}`, 'true');
                message.success('Authentication successful!');
                setAuthState({
                    isLoading: false,
                    isAuthenticated: true,
                    showFacialAuth: false,
                    authError: false,
                });
            } else {
                setAuthState({
                    isLoading: false,
                    isAuthenticated: false,
                    showFacialAuth: false,
                    authError: true,
                });
            }
        } catch (error) {
            console.error('Error during facial authentication:', error);
            setAuthState({
                isLoading: false,
                isAuthenticated: false,
                showFacialAuth: false,
                authError: true,
            });
        }
    };

    const handleAuthCancel = () => {
        // User cancelled authentication - redirect to home
        setAuthState({
            isLoading: false,
            isAuthenticated: false,
            showFacialAuth: false,
            authError: true,
        });
    };

    const handleRetry = () => {
        setAuthState({
            isLoading: false,
            isAuthenticated: false,
            showFacialAuth: true,
            authError: false,
        });
    };

    if (authState.isLoading) {
        return <Spin size="large" fullscreen={true} tip="Verifying authentication..." />;
    }

    if (authState.authError) {
        return (
            <Result
                status="error"
                title="Authentication Failed"
                subTitle="Facial recognition authentication failed. Please try again or contact support."
                extra={[
                    <Button type="primary" key="retry" onClick={handleRetry}>
                        Try Again
                    </Button>,
                    <Button key="home" onClick={() => window.location.href = '/'}>
                        Go Home
                    </Button>,
                ]}
            />
        );
    }

    if (authState.showFacialAuth) {
        return (
            <FacialRecognition
                visible={authState.showFacialAuth}
                onUpload={handleFacialAuth}
                onCancel={handleAuthCancel}
                title="Facial Recognition Authentication"
                buttonText="Verify"
            />
        );
    }

    if (!authState.isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
