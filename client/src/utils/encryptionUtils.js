import forge from 'node-forge';

function generateSecretKey() {
    const keyBytes = forge.random.getBytesSync(32);
    return forge.util.bytesToHex(keyBytes);
}

function generateRSAKeyPair() {
    const keyPair = forge.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
    const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
    const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
    return { publicKey: publicKeyPem, privateKey: privateKeyPem };
}   

function encryptDataWithSecretKey(secretKey, data) {
    const keyBytes = forge.util.hexToBytes(secretKey);
    const cipher = forge.cipher.createCipher('AES-ECB', keyBytes);
    cipher.start();
    cipher.update(forge.util.createBuffer(data));
    cipher.finish();
    return cipher.output.toHex();
}

function decryptDataWithSecretKey(secretKey, encryptedData) {
    const keyBytes = forge.util.hexToBytes(secretKey);
    const decipher = forge.cipher.createDecipher('AES-ECB', keyBytes);
    decipher.start();
    decipher.update(forge.util.createBuffer(forge.util.hexToBytes(encryptedData)));
    decipher.finish();
    return decipher.output.data;
}

function encryptSecretKey(secretKey, doctorPublicKey) {
    const doctorPublicKeyForge = forge.pki.publicKeyFromPem(doctorPublicKey);
    const encryptedWithDoctorPublicKey = doctorPublicKeyForge.encrypt(secretKey);
    return forge.util.bytesToHex(encryptedWithDoctorPublicKey);
}

function decryptSecretKey(encryptedSecretKey, doctorPrivateKey) {
    const doctorPrivateKeyForge = forge.pki.privateKeyFromPem(doctorPrivateKey);
    const decryptedWithDoctorPrivateKey = doctorPrivateKeyForge.decrypt(forge.util.hexToBytes(encryptedSecretKey));
    return decryptedWithDoctorPrivateKey;
}

function signMessage(privateKeyPem, message) {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const md = forge.md.sha256.create();
    md.update(message, 'utf8');
    const signature = privateKey.sign(md);
    return forge.util.bytesToHex(signature);
}

function verifySignedMessage(publicKeyPem, message, signatureHex) {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const md = forge.md.sha256.create();
    md.update(message, 'utf8');
    const signature = forge.util.hexToBytes(signatureHex);
    return publicKey.verify(md.digest().bytes(), signature);
}

export { 
    generateSecretKey,
    generateRSAKeyPair,
    encryptDataWithSecretKey,
    decryptDataWithSecretKey,
    encryptSecretKey,
    decryptSecretKey,
    signMessage,
    verifySignedMessage
};
