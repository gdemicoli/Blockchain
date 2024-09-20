import { prime, modInv, gcd, modPow } from 'bigint-crypto-utils';
import * as crypto from 'crypto';
//when created: creates public and private keys which are permanent
//Has a method to take a message and signs it
//RSA implementation
export class DigitalSignature2 {
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
        let primeNumber = await prime(bits);
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
        } while (gcd(e, phi) !== 1n);
        //calculate inverse mod of e and phi 
        const d = modInv(e, phi);
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
        //hashes message and transforms it into a big int
        let messageBigInt = this.stringToMD5BigInt(message);
        //returns the signed message
        return modPow(messageBigInt, this.privateKey.d, this.privateKey.n);
    }
    stringToMD5BigInt(message) {
        // generates MD5 hash
        this.hash = crypto.createHash('md5').update(message).digest('hex');
        let hash = crypto.createHash('md5').update(message).digest('hex');
        // converts the MD5 hash to BigInt
        let hashBigInt = BigInt('0x' + hash);
        return hashBigInt;
    }
    verifySignature(message, signature, eValue, nValue) {
        //performs decryption calculation
        let decryptedMessageBigInt = modPow(signature, eValue, nValue);
        // prior to signing we hash the message and change it to a big int
        // so here we need to do that to the message for comparison
        // so that they are in the same form
        let hashBigIntMessage = this.stringToMD5BigInt(message);
        if (decryptedMessageBigInt === hashBigIntMessage) {
            return true;
        }
        else {
            return false;
        }
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
}
//# sourceMappingURL=DigitalSignature2.js.map