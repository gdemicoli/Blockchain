"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitalSignature2 = void 0;
const bigint_crypto_utils_1 = require("bigint-crypto-utils");
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
    static gcdBigInt(a, b) {
        if (b === 0n) {
            return a;
        }
        return this.gcdBigInt(b, a % b);
    }
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
}
exports.DigitalSignature2 = DigitalSignature2;
//# sourceMappingURL=DigitalSignature2.js.map