import { prime, modInv, modPow } from 'bigint-crypto-utils';
export class PublicKeyGenerator {
    constructor() {
        this.tValues = [];
        this.ids = [];
        this.init();
        this.numSigners = 0;
    }
    async init() {
        //generate p & q prime numbers
        // 1.
        // this.p = await this.generatePrime(30);
        // this.q = await this.generatePrime(30);
        this.p = 307699126915021078949717556805305347641n;
        this.q = 286189067004968539490940912607240844261n;
        console.log("P value is: " + this.p);
        console.log("Q value is: " + this.q);
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
        //2. page 5
        let e = 71n;
        //check to make sure e and phi n are coprime
        // let e: bigint;
        // do {
        //     e = await this.generatePrime(32);
        // } while (gcd(e, phi) !== 1n);
        //calculate inverse mod of e and phi 
        const d = modInv(e, phi);
        this.publicKey = { e, n };
        this.privateKey = { d, n };
        console.log("n is: " + this.publicKey.n);
        console.log("e is: " + this.publicKey.e);
        console.log("d is: " + this.privateKey.d);
    }
    addSigner(id) {
        this.numSigners += 1;
        this.ids.push(id);
        // calculates he signers g value
        console.log(id + " created g value " + modPow(id, this.privateKey.d, this.privateKey.n));
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
        this.aggregateT = modPow(productT, 1, this.publicKey.n);
        return this.aggregateT;
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
    getIDs() {
        return this.ids;
    }
    getAggregateT() {
        return this.aggregateT;
    }
}
//# sourceMappingURL=PKG.js.map