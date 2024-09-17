import { prime, modInv, gcd } from 'bigint-crypto-utils';



//when created: creates public and private keys which are permanent
//Has a method to take a message and signs it
//RSA implementation

export class DigitalSignature2 {
    
    // create member variables for keys
    private privateKey!: { d: bigint; n: bigint };
    private publicKey!: { e: bigint; n: bigint };
    private p!: bigint;
    private q!: bigint;
    

    constructor() {

        this.init();
    }

    private async init(){
        //generate p & q prime numbers
        this.p = await this.generatePrime(130);
        this.q = await this.generatePrime(130);

        this.generateKeyPair();
    }

    private async generatePrime(bits: number): Promise<bigint> {
        // Generate a prime number with the specified number of bits
        let primeNumber: bigint = await prime(bits);
        return primeNumber;
    }
 
    
    // generates public and private keys for rsa
    private async generateKeyPair() {
        const n: bigint = this.p * this.q;
        const phi: bigint = (this.p -1n) * (this.q -1n);

        
        //check to make sure e and phi n are coprime
        let e: bigint;
        do {
            e = await this.generatePrime(32);
        } while (gcd(e, phi) !== 1n);

        //calculate inverse mod of e and phi 
        const d = modInv(e, phi); 

        this.publicKey = { e, n };
        this.privateKey = { d, n };


    }

    private static gcdBigInt(a: bigint, b: bigint): bigint {
        if (b === 0n) {
            return a;
        }
        return this.gcdBigInt(b, a % b);
    }

    public getPublicKey(): { e: bigint; n: bigint } {
        return this.publicKey;
    }

    public getPrivateKey(): { d: bigint; n: bigint } {
        return this.privateKey;
    }

    public getP(): bigint {
        return this.p;
    }

    public getQ(): bigint {
        return this.q
    }


  

}