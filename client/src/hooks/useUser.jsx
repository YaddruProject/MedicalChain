import { useContext } from 'react';
import { ContractContext } from '@context/ContractContext';

const useUser = () => {
    const { user } = useContext(ContractContext);
    return user;
}

export default useUser;
