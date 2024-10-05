import { useState, createContext } from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';

import Config from '../config/config';

export const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [contract, setContract] = useState(null);
    const [user, setUser] = useState({
        address: null,
        role: null,
        signer: null
    });

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

    return (
        <ContractContext.Provider value={{ user, contract, connectWallet, disconnectWallet, isLoggedIn }}>
            {children}
        </ContractContext.Provider>
    )
}

ContractProvider.propTypes = {
    children: PropTypes.node.isRequired
}
