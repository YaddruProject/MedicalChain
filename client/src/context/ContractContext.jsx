import { useState, createContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import { message } from 'antd';

import Config from '@config/config';
import { generateSecretKey, generateRSAKeyPair } from '@utils/encryptionUtils';

export const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [contract, setContract] = useState(null);
    const [user, setUser] = useState({
        address: null,
        role: null,
        signer: null
    });

    const setSecretKey = async () => {
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
    }

    const setRSAKeys = async () => {
        if ([2, 3].includes(Number(user.role))) {
            const publicKey = await contract.getPublicKey(user.address);
            if (!publicKey) {
                try {
                    message.info('New user detected. Generating RSA keys...');
                    const rsaKeys = await generateRSAKeyPair();
                    await contract.setRSAKeyPair(rsaKeys.publicKey, rsaKeys.privateKey);
                    message.success('RSA keys set successfully.');
                } catch (err) {
                    alert('Failed to set RSA keys.');
                    console.log(err);
                }
            }
        }
    }

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
                await setRSAKeys();
            })();
        }
    }, [contract, user]);

    return (
        <ContractContext.Provider value={{ user, contract, connectWallet, disconnectWallet, isLoggedIn }}>
            {children}
        </ContractContext.Provider>
    )
}

ContractProvider.propTypes = {
    children: PropTypes.node.isRequired
}
