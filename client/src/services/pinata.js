import { PinataSDK } from 'pinata-web3';

import Config from '../config/config';

export const pinata = new PinataSDK({
    pinataJwt: Config.PINATA_JWT,
    pinataGateway: Config.PINATA_GATEWAY,
});
