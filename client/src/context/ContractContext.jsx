import { useState, createContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import { message } from 'antd';

import Config from '@config/config';
import { generateSecretKey, generateECCKeyPair } from '@utils/encryptionUtils';
import FacialRecognition from '@components/FacialRecognition';
import { setupBiometrics } from '@utils/biometricsUtils';

export const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [contract, setContract] = useState(null);
    const [user, setUser] = useState({
        address: null,
        role: null,
        signer: null
    });
    const [showFacialRecognition, setShowFacialRecognition] = useState(false);
    const [isBiometricsSetupComplete, setIsBiometricsSetupComplete] = useState(false);

    const setSecretKey = useCallback(async () => {
        if (Number(user.role) === 3) {
            const secretKey = await contract.getSecretKey();
            if (!secretKey) {
                try {
                    message.info('New user detected. Generating secret key...');
                    const secretKey = generateSecretKey();
                    await contract.setNewPatientSecretKey(secretKey);
                    message.success('Secret key set successfully.');
                } catch (err) {
                    alert('Failed to set secret key.');
                    console.log(err);
                }
            }
        }
    }, [contract, user.role]);

    const setECCKeys = useCallback(async () => {
        if ([2, 3].includes(Number(user.role))) {
            const publicKey = await contract.getPublicKey(user.address);
            if (!publicKey) {
                try {
                    message.info('New user detected. Generating ECC keys...');
                    const eccKeys = await generateECCKeyPair();
                    await contract.setKeyPair(eccKeys.publicKey, eccKeys.privateKey);
                    message.success('ECC keys set successfully.');
                } catch (err) {
                    alert('Failed to set ECC keys.');
                    console.log(err);
                }
            }
        }
    }, [contract, user.role, user.address]);

    const checkAndSetupBiometrics = useCallback(async () => {
        if ([2, 3].includes(Number(user.role))) {
            const biometricsCID = await contract.getBiometrics();
            if (!biometricsCID) {
                // New user - show facial recognition modal
                message.info('Setting up facial recognition for your account...');
                setShowFacialRecognition(true);
                setIsBiometricsSetupComplete(false);
            } else {
                setIsBiometricsSetupComplete(true);
            }
        }
    }, [contract, user.role]);

    const handleFacialUpload = useCallback(async (facialImage) => {
        try {
            await setupBiometrics(contract, facialImage);
            setShowFacialRecognition(false);
            setIsBiometricsSetupComplete(true);
        } catch (error) {
            console.error('Failed to setup biometrics:', error);
            message.error('Failed to setup facial recognition. Please try again.');
        }
    }, [contract]);

    const handleFacialCancel = useCallback(() => {
        message.warning('Facial recognition setup is required to continue');
        // Don't close modal for new users - they must complete setup
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask first.');
            return;
        }
        try {
            await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(Config.CONTRACT_ADDRESS, Config.CONTRACT_ABI, signer);
            const role = await contract.getRole(signer.getAddress());
            const address = await signer.getAddress();
            setUser({ address, role, signer });
            setContract(contract);
            setIsLoggedIn(true);
        } catch (err) {
            alert('Failed to connect wallet.');
            console.log(err);
        }
    }

    const disconnectWallet = () => {
        setUser({ address: null, role: null, signer: null });
        setContract(null);
        setIsLoggedIn(false);
    }

    useEffect(() => {
        if (contract && user.address && user.role) {
            (async () => {
                await setSecretKey();
                await setECCKeys();
                await checkAndSetupBiometrics();
            })();
        }
    }, [contract, user, setSecretKey, setECCKeys, checkAndSetupBiometrics]);

    return (
        <ContractContext.Provider value={{ 
            user, 
            contract, 
            connectWallet, 
            disconnectWallet, 
            isLoggedIn,
            isBiometricsSetupComplete
        }}>
            {children}
            <FacialRecognition
                visible={showFacialRecognition}
                onUpload={handleFacialUpload}
                onCancel={handleFacialCancel}
                title="Setup Facial Recognition"
            />
        </ContractContext.Provider>
    )
}

ContractProvider.propTypes = {
    children: PropTypes.node.isRequired
}
