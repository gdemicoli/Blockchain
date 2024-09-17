"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitalSignature = void 0;
const crypto = __importStar(require("crypto"));
//when created: creates public and private keys which are permanent
//Has a method to take a message and signs it
// need to do the maths yourself
class DigitalSignature {
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
exports.DigitalSignature = DigitalSignature;
//# sourceMappingURL=DigitalSignature.js.map