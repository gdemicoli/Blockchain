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
exports.DigitalSignature2 = void 0;
const bigint_crypto_utils_1 = require("bigint-crypto-utils");
const crypto = __importStar(require("crypto"));
//when created: creates public and private keys which are permanent
//Has a method to take a message and signs it
//RSA implementation
class DigitalSignature2 {
    constructor() {
        this.init();
    }
    async init() {
        //generate p & q prime numbers
        this.p = await this.generatePrime(130);
        this.q = await this.generatePrime(130);
        this.generateKeyPair();
    }
    async generatePrime(bits) {
        // Generate a prime number with the specified number of bits
        let primeNumber = await (0, bigint_crypto_utils_1.prime)(bits);
        return primeNumber;
    }
    // generates public and private keys for rsa
    async generateKeyPair() {
        const n = this.p * this.q;
        const phi = (this.p - 1n) * (this.q - 1n);
        //check to make sure e and phi n are coprime
        let e;
        do {
            e = await this.generatePrime(32);
        } while ((0, bigint_crypto_utils_1.gcd)(e, phi) !== 1n);
        //calculate inverse mod of e and phi 
        const d = (0, bigint_crypto_utils_1.modInv)(e, phi);
        this.publicKey = { e, n };
        this.privateKey = { d, n };
    }
    //gcd calculator
    static gcdBigInt(a, b) {
        if (b === 0n) {
            return a;
        }
        return this.gcdBigInt(b, a % b);
    }
    signMessage(message) {
        let messageBigInt = this.stringToMD5BigInt(message);
        // console.log("hash to big int " + "of message: " + message + " is: " + messageBigInt)
        return (0, bigint_crypto_utils_1.modPow)(messageBigInt, this.privateKey.d, this.privateKey.n);
    }
    stringToMD5BigInt(message) {
        // Step 1: Generate MD5 hash
        let hash = crypto.createHash('md5').update(message).digest('hex');
        // Step 2: Convert the MD5 hash (hex string) to BigInt
        let hashBigInt = BigInt('0x' + hash);
        return hashBigInt;
    }
    verifySignature(message, signature, eValue, nValue) {
        let decryptedMessageBigInt = (0, bigint_crypto_utils_1.modPow)(signature, eValue, nValue);
        let decryptedMessageString = decryptedMessageBigInt.toString();
        // let decryptedMessage = crypto.createHash('md5').update(decryptedMessageString).digest('hex');
        console.log("Decrypted message is: " + decryptedMessageString);
        let hashBigIntMessage = this.stringToMD5BigInt(message);
        console.log("hash big into of message is: " + hashBigIntMessage);
        return true;
    }
    // getter methods:
    getPublicKey() {
        return this.publicKey;
    }
    getPrivateKey() {
        return this.privateKey;
    }
    getP() {
        return this.p;
    }
    getQ() {
        return this.q;
    }
    getNumericalMessage() {
        return this.messageBigInt;
    }
}
exports.DigitalSignature2 = DigitalSignature2;
//# sourceMappingURL=DigitalSignature2.js.map