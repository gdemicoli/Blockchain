import { prime, modInv, gcd, modPow } from 'bigint-crypto-utils';
export class PublicKeyGenerator {
    constructor() {
        this.tValues = [];
        this.init();
        this.numSigners = 0;
    }
    async init() {
        //generate p & q prime numbers
        this.p = await this.generatePrime(80);
        this.q = await this.generatePrime(80);
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
    addSigner(id) {
        this.numSigners += 1;
        // calculates he signers g value
        return modPow(id, this.privateKey.d, this.privateKey.n);
    }
    addTValue(t) {
        this.tValues.push(t);
    }
    computeAggregateT() {
        let productT = BigInt(1);
        for (let i = 0; i < this.tValues.length; i++) {
            productT = productT * this.tValues[i];
        }
        return modPow(productT, 1, this.publicKey.n);
    }
    getE() {
        return this.publicKey.e;
    }
    getN() {
        return this.publicKey.n;
    }
    getD() {
        return this.privateKey.d;
    }
}
//# sourceMappingURL=PKG.js.map