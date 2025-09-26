import crypto from 'node:crypto';
import fs from 'node:fs';
const INCRYPTION_SECRET_KEY = Buffer.from('f4e8b4c7a1d9e6b2f0c8d5a3e7b1d9f2a5c8e3b6d9f0a1e4c7b2d5f8e1a3c6b9', 'hex')
const IV_LENGTH = 16;

export const encrypt = (text) => {

    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv('aes-256-cbc', INCRYPTION_SECRET_KEY, iv);
    let encryptedText = cipher.update(text, 'utf-8', 'hex');
    encryptedText += cipher.final('hex');
    return `${iv.toString('hex')}:${encryptedText}`;

}


export const decrypt = (encryptedData) => {


    const [iv, encryptedText] = encryptedData.split(':');

    const binaryIV = Buffer.from(iv, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', INCRYPTION_SECRET_KEY, binaryIV);

    let decryptedText = decipher.update(encryptedText, 'hex', 'utf-8');
    decryptedText += decipher.final('utf-8');

    return decryptedText;
}



if (fs.existsSync('publicKey.pem') && fs.existsSync('privateKey.pem')) {
    console.log('Keys already exist');
} else {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });

    fs.writeFileSync('publicKey.pem', publicKey);
    fs.writeFileSync('privateKey.pem', privateKey);

}

export const asymmetricEncrypt = (text) => {

    const bufferText = Buffer.from(text);
    const publicKey = fs.readFileSync('publicKey.pem', 'utf-8');

    const encryptedText = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    }, bufferText);
    return encryptedText.toString('hex');
}


export const asymmetricDecrypt = (encryptedData) => {

    const privateKey = fs.readFileSync('privateKey.pem', 'utf-8');

    const encryptedBuffer = Buffer.from(encryptedData, 'hex');
    const decryptedText = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    }, encryptedBuffer);

    return decryptedText.toString('utf-8');
}

