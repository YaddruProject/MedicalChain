import { PinataSDK } from 'pinata-web3';
import { message } from 'antd';

import Config from '@config/config';

const pinata = new PinataSDK({
    pinataJwt: Config.PINATA_JWT,
    pinataGateway: Config.PINATA_GATEWAY,
});

pinata.uploadToIPFS = async (file) => {
    try {
        const fileObj = new File([file], 'encryptedFile', { type: 'application/octet-stream' });
        const result = await pinata.upload.file(fileObj);
        return result.IpfsHash;
    } catch (error) {
        message.error('Error uploading to IPFS');
        console.error(error);
        return null;
    }
}

pinata.getIPFSUrl = (hash) => {
    return `https://ipfs.io/ipfs/${hash}`;
}

export { pinata };
