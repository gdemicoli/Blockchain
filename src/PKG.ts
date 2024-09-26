import { prime, modInv, gcd, modPow } from 'bigint-crypto-utils';
import * as crypto from 'crypto';

export class PublicKeyGenerator{

    private publicKey!: { e: bigint; n: bigint }
    private privateKey!: { d: bigint; n: bigint };
    private p!: bigint;
    private q!: bigint;
    private numSigners: number;
    private tValues: bigint[] 

    constructor() {
        this.tValues = []
        this.init();
        
        this.numSigners = 0
    }

    private async init(){
        //generate p & q prime numbers
        this.p = await this.generatePrime(80);
        this.q = await this.generatePrime(80);
        

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

    public addSigner(id: number):bigint {
        this.numSigners+=1;

        // calculates he signers g value

        
        return modPow(id, this.privateKey.d, this.privateKey.n)

    }

    public addTValue(t: bigint){
        this.tValues.push(t)
    }

    public computeAggregateT():bigint {

        let productT = BigInt(1)
        for(let i = 0; i < this.tValues.length; i++){
            productT = productT * this.tValues[i] 
        }

        return modPow(productT, 1, this.publicKey.n )

    }

    public getE(): bigint {
        return this.publicKey.e
    }
    public getN(): bigint {
        return this.publicKey.n
    }
    public getD(): bigint {
        return this.privateKey.d
    }







}