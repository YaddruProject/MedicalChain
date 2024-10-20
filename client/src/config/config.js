import { z } from 'zod';

const configSchema = z.object({
    VITE_CONTRACT_ADDRESS: z.string(),
    VITE_CONTRACT_ABI: z.string().transform((val) => {
        try {
            const parsedJson = JSON.parse(val);
            return parsedJson;
            // TODO: Validate ABI - IDK why tf it's not working
            // const abi = z.array(z.object()).safeParse(parsedJson);
            // if (!abi.success) {
            //     throw new Error('Invalid ABI: ' + abi.error.errors);
            // }
            // return abi.data;
        } catch (error) {
            throw new Error('Invalid ABI: ' +  error);
        }
    }),
    VITE_PINATA_JWT: z.string(),
    VITE_PINATA_GATEWAY: z.string(),
});

class Config {
    constructor() {
        const config = configSchema.safeParse(import.meta.env);
        if (!config.success) {
            throw new Error('Please fill configs in .env file');
        }
        this.CONTRACT_ADDRESS = config.data.VITE_CONTRACT_ADDRESS;
        this.CONTRACT_ABI = config.data.VITE_CONTRACT_ABI;
        this.PINATA_JWT = config.data.VITE_PINATA_JWT;
        this.PINATA_GATEWAY = config.data.VITE_PINATA_GATEWAY;
    }
}

export default new Config();