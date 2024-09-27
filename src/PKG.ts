import { prime, modInv, gcd, modPow } from 'bigint-crypto-utils';
import * as crypto from 'crypto';

export class PublicKeyGenerator{

    private publicKey!: { e: bigint; n: bigint }
    private privateKey!: { d: bigint; n: bigint };
    private p!: bigint;
    private q!: bigint;
    private numSigners: number;
    private ids: number[];
    private tValues: bigint[] 
    private aggregateT!: bigint

    constructor() {
        this.tValues = []
        this.ids = []
        this.init();
        
        this.numSigners = 0
    }

    private async init(){
        //generate p & q prime numbers

        // 1.
        // this.p = await this.generatePrime(30);
        // this.q = await this.generatePrime(30);
        this.p = 307699126915021078949717556805305347641n
        this.q = 286189067004968539490940912607240844261n

        console.log("P value is: " + this.p)
        console.log("Q value is: " + this.q)
        

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

        //2. page 5
        let e: bigint = 71n

        //check to make sure e and phi n are coprime
        // let e: bigint;
        // do {
        //     e = await this.generatePrime(32);
        // } while (gcd(e, phi) !== 1n);

        //calculate inverse mod of e and phi 
        const d = modInv(e, phi); 

        this.publicKey = { e, n };
        this.privateKey = { d, n };

        console.log("n is: " + this.publicKey.n)
        console.log("e is: " + this.publicKey.e)
        console.log("d is: " + this.privateKey.d)


    }

    public addSigner(id: number):bigint {
        this.numSigners+=1;
        this.ids.push(id)

        // calculates he signers g value

        console.log(id + " created g value " + modPow(id, this.privateKey.d, this.privateKey.n))
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

        this.aggregateT =modPow(productT, 1, this.publicKey.n )
        return this.aggregateT

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
    public getIDs(): number[] {
        return this.ids
    }
    public getAggregateT(): bigint {
        return this.aggregateT
    }







}