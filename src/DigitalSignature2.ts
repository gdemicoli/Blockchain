import { prime, modInv, gcd, modPow } from 'bigint-crypto-utils';
import * as crypto from 'crypto';



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

    //gcd calculator
    private static gcdBigInt(a: bigint, b: bigint): bigint {
        if (b === 0n) {
            return a;
        }
        return this.gcdBigInt(b, a % b);
    }

    public signMessage(message: string): bigint {
        //hashes message and transforms it into a big int
        let messageBigInt = this.stringToMD5BigInt(message);

        //returns the signed message
        return modPow(messageBigInt, this.privateKey.d, this.privateKey.n);
        
    }

    private stringToMD5BigInt(message: string): bigint {
        // generates MD5 hash
        let hash = crypto.createHash('md5').update(message).digest('hex');
    
        // converts the MD5 hash to BigInt
        let hashBigInt = BigInt('0x' + hash);
    
        return hashBigInt;

    }
    
    
    public verifySignature(message: string, signature: bigint, eValue: bigint, nValue: bigint): boolean {
        //performs decryption calculation
        let decryptedMessageBigInt = modPow(signature, eValue, nValue);
        let decryptedMessageString = decryptedMessageBigInt.toString();
        
        console.log("Decrypted message is: " + decryptedMessageString);

        // prior to signing we hash the message and change it to a big int
        // so here we need to do that to the message for comparison
        // so that they are in the same form

        let hashBigIntMessage = this.stringToMD5BigInt(message)

        console.log("hash big into of message is: " + hashBigIntMessage)
        return true
    }
    


    // getter methods:
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
        return this.q;
    }

}