import { useContext } from 'react';
import { ContractContext } from '../context/ContractContext';

const useIsLoggedIn = () => {
    const { isLoggedIn } = useContext(ContractContext);
    return isLoggedIn;
}

export default useIsLoggedIn;
