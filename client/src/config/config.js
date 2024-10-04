import { z } from 'zod';

const configSchema = z.object({
    VITE_CONTRACT_ADDRESS: z.string(),
    VITE_CONTRACT_ABI: z.string(),
});

class Config {
    constructor() {
        const config = configSchema.safeParse(import.meta.env);
        if (!config.success) {
            throw new Error('Please fill configs in .env file');
        }
        this.CONTRACT_ADDRESS = config.data.VITE_CONTRACT_ADDRESS;
        this.loadABI(config.data.VITE_CONTRACT_ABI).then((abi) => {
            this.CONTRACT_ABI = abi.abi;
        });
    }
    
    async loadABI(path) {
        const abi = await import(`../../../web3/artifacts/contracts/${path}.sol/${path}.json`);
        return abi;
    }
}

export default new Config();