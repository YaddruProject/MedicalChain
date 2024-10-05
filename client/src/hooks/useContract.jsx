import { useContext } from "react";
import { ContractContext } from "../context/ContractContext";

const useContract = () => {
    const { contract } = useContext(ContractContext);
    return contract;
}

export default useContract;
