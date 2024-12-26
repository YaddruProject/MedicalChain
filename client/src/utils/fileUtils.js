async function generateFileSHA256(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function verifyFileSHA256(file, hash) {
    const fileHash = await generateFileSHA256(file);
    return fileHash === hash;
}

export { generateFileSHA256, verifyFileSHA256 };
