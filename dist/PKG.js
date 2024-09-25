import { prime, modInv, gcd } from 'bigint-crypto-utils';
export class PublicKeyGenerator {
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
}
//# sourceMappingURL=PKG.js.map