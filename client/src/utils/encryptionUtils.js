import forge from 'node-forge';
import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');

function generateSecretKey() {
    const keyBytes = forge.random.getBytesSync(32);
    return forge.util.bytesToHex(keyBytes);
}

function generateECCKeyPair() {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate('hex');
    const publicKey = keyPair.getPublic('hex');
    return { publicKey, privateKey };
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

// Encrypt secret key using ECDH (Elliptic Curve Diffie-Hellman)
function encryptSecretKey(secretKey, doctorPublicKeyHex) {
    // Generate ephemeral key pair
    const ephemeralKeyPair = ec.genKeyPair();
    
    // Recreate doctor's public key from hex
    const doctorPublicKey = ec.keyFromPublic(doctorPublicKeyHex, 'hex');
    
    // Perform ECDH to get shared secret
    const sharedSecret = ephemeralKeyPair.derive(doctorPublicKey.getPublic());
    const sharedSecretHex = sharedSecret.toString(16).padStart(64, '0');
    
    // Use shared secret to encrypt the secret key with AES
    const sharedSecretBytes = forge.util.hexToBytes(sharedSecretHex);
    const cipher = forge.cipher.createCipher('AES-ECB', sharedSecretBytes);
    cipher.start();
    cipher.update(forge.util.createBuffer(secretKey, 'utf8'));
    cipher.finish();
    const encryptedSecretKey = cipher.output.toHex();
    
    // Return ephemeral public key + encrypted data
    const ephemeralPublicKey = ephemeralKeyPair.getPublic('hex');
    return ephemeralPublicKey + ':' + encryptedSecretKey;
}

// Decrypt secret key using ECDH (Elliptic Curve Diffie-Hellman)
function decryptSecretKey(encryptedData, doctorPrivateKeyHex) {
    // Split ephemeral public key and encrypted data
    const [ephemeralPublicKeyHex, encryptedSecretKey] = encryptedData.split(':');
    
    // Recreate ephemeral public key
    const ephemeralPublicKey = ec.keyFromPublic(ephemeralPublicKeyHex, 'hex');
    
    // Recreate doctor's private key
    const doctorPrivateKey = ec.keyFromPrivate(doctorPrivateKeyHex, 'hex');
    
    // Perform ECDH to get shared secret
    const sharedSecret = doctorPrivateKey.derive(ephemeralPublicKey.getPublic());
    const sharedSecretHex = sharedSecret.toString(16).padStart(64, '0');
    
    // Use shared secret to decrypt the secret key
    const sharedSecretBytes = forge.util.hexToBytes(sharedSecretHex);
    const decipher = forge.cipher.createDecipher('AES-ECB', sharedSecretBytes);
    decipher.start();
    decipher.update(forge.util.createBuffer(forge.util.hexToBytes(encryptedSecretKey)));
    decipher.finish();
    
    return decipher.output.data;
}

// Sign message using ECDSA (Elliptic Curve Digital Signature Algorithm)
function signMessage(privateKeyHex, message) {
    const keyPair = ec.keyFromPrivate(privateKeyHex, 'hex');
    
    // Hash the message
    const md = forge.md.sha256.create();
    md.update(message, 'utf8');
    const messageHash = md.digest().toHex();
    
    // Sign the hash
    const signature = keyPair.sign(messageHash);
    return signature.toDER('hex');
}

// Verify signed message using ECDSA (Elliptic Curve Digital Signature Algorithm)
function verifySignedMessage(publicKeyHex, message, signatureHex) {
    const keyPair = ec.keyFromPublic(publicKeyHex, 'hex');
    
    // Hash the message
    const md = forge.md.sha256.create();
    md.update(message, 'utf8');
    const messageHash = md.digest().toHex();
    
    // Verify the signature
    return keyPair.verify(messageHash, signatureHex);
}

export { 
    generateSecretKey,
    generateECCKeyPair,
    encryptDataWithSecretKey,
    decryptDataWithSecretKey,
    encryptSecretKey,
    decryptSecretKey,
    signMessage,
    verifySignedMessage
};
