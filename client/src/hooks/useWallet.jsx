import { useContext } from 'react';
import { ContractContext } from '@context/ContractContext';

const useWallet = () => {
    const { connectWallet, disconnectWallet } = useContext(ContractContext);
    return { connectWallet, disconnectWallet };
}

export default useWallet;
