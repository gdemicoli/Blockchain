import * as crypto from 'crypto';
//when created: creates public and private keys which are permanent
//Has a method to take a message and signs it
// need to do the maths yourself
export class DigitalSignature {
    constructor() {
        this.generateKeyPair();
    }
    // generates public and private keys for dsa
    generateKeyPair() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('dsa', {
            modulusLength: 2048,
            divisorLength: 256,
            // p, q & g are computed into a single number representing the public key
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            // private key is generated and protected by the passphrase
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                //add passphrase if necesary
                // cipher: 'aes-256-cbc',
                // passphrase: passphrase
            }
        });
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }
    getPublicKey() {
        return this.publicKey;
    }
    signMessage(message) {
        // hash as md5
        const sign = crypto.createSign('md5');
        // sign message using private key
        sign.update(message);
        sign.end();
        const signature = sign.sign({
            key: this.privateKey
        });
        return signature.toString('base64');
    }
    verifyMessage(message, signature) {
        const verify = crypto.createVerify('md5');
        verify.update(message);
        verify.end();
        return verify.verify(this.publicKey, signature, 'base64');
    }
}
//# sourceMappingURL=DigitalSignature.js.map