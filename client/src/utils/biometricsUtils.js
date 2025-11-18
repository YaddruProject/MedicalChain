import { message } from 'antd';
import { pinata } from '@services/pinata';
import apiClient from '@services/api';

export const uploadFacialImageToIPFS = async (imageFile) => {
    try {
        const hash = await pinata.uploadToIPFS(imageFile);
        if (!hash) {
            throw new Error('Failed to upload to IPFS');
        }
        return hash;
    } catch (error) {
        console.error('Error uploading facial image to IPFS:', error);
        message.error('Failed to upload facial image to IPFS');
        throw error;
    }
};

export const downloadFacialImageFromIPFS = async (cid) => {
    try {
        const url = pinata.getIPFSUrl(cid);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch image from IPFS');
        }
        const blob = await response.blob();
        return blob;
    } catch (error) {
        console.error('Error downloading facial image from IPFS:', error);
        message.error('Failed to download facial image from IPFS');
        throw error;
    }
};

export const verifyFacialImages = async (image1, image2) => {
    try {
        const formData = new FormData();
        const file1 = image1 instanceof File ? image1 : new File([image1], 'stored-image.jpg', { type: 'image/jpeg' });
        const file2 = image2 instanceof File ? image2 : new File([image2], 'captured-image.jpg', { type: 'image/jpeg' });
        formData.append('img1', file1);
        formData.append('img2', file2);
        const response = await apiClient.post('/biometrics/verify', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return {
            verified: response.data.verified,
            confidence: response.data.confidence,
        };
    } catch (error) {
        console.error('Error verifying facial images:', error);
        message.error('Failed to verify facial images');
        throw error;
    }
};

export const authenticateWithBiometrics = async (storedCID, capturedImage) => {
    try {
        const storedImageBlob = await downloadFacialImageFromIPFS(storedCID);
        const result = await verifyFacialImages(storedImageBlob, capturedImage);
        return result.verified;
    } catch (error) {
        console.error('Error during biometric authentication:', error);
        return false;
    }
};

export const setupBiometrics = async (contract, facialImage) => {
    try {
        const cid = await uploadFacialImageToIPFS(facialImage);
        const tx = await contract.setBiometrics(cid);
        await tx.wait();
        message.success('Facial recognition setup completed successfully');
        return cid;
    } catch (error) {
        console.error('Error setting up biometrics:', error);
        message.error('Failed to setup facial recognition');
        throw error;
    }
};
