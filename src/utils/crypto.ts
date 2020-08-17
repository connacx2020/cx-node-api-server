import crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = '7641197547c1f35e2cdf3e268eac01a46a36d7dd7a53802e8576fb66811870c1';
const iv = '7546702acaaa4e4047ecfdcfb4e25d28';

exports.encrypt = (text: string) => {
    let ivBuffer = Buffer.from(iv, 'hex');
	const keyBuffer = Buffer.from(key, 'hex');
    let cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

exports.decrypt = (text: string) => {
    let ivBuffer = Buffer.from(iv, 'hex');
	const keyBuffer = Buffer.from(key, 'hex');
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
