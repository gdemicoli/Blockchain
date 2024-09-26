import { prime, modInv, gcd, modPow } from 'bigint-crypto-utils';
import * as crypto from 'crypto';



//when created: creates public and private keys which are permanent
//Has a method to take a message and signs it
//RSA implementation

export class IdentityDigitalSignature{
    
    // create member variables for keys
    private privateKeyG: bigint
    private eValue: bigint
    private randInt!: bigint
    private tValue!: bigint
    private sValue!: bigint
    private publicKeyN: bigint
    private hashTM!: bigint
    

    constructor(privateKey: bigint, eValue: bigint, nValue: bigint) {
        this.privateKeyG = privateKey;
        this.eValue = eValue;
        this.publicKeyN = nValue

        this.init().then(() => {
            this.tValue = modPow(this.randInt, this.eValue, this.publicKeyN);
        });
    }   

    private async init(){
        //generate p & q prime numbers
        this.randInt = await this.generatePrime(20)

    }

    private async generatePrime(bits: number): Promise<bigint> {
        // Generate a prime number with the specified number of bits
        let primeNumber: bigint = await prime(bits);
        return primeNumber;
    }

    // private generatePrime(): bigint{
    //     // Generate a prime number with the specified number of bits
    //     let primeNumbers = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47]
    //     let randomIndex = Math.floor(Math.random() * primeNumbers.length);
    //     // Return the prime number at the randomly selected index
    //     return BigInt(primeNumbers[randomIndex])
    // }

//     private async generatePrime(bits: number): Promise<bigint> {
//         // Generate a prime number with the specified number of bits
//         let primeNumber: bigint = await prime(bits);
//         return primeNumber;
//     }
 
    
//     // generates public and private keys for rsa
//     private async generateKeyPair() {
//         const n: bigint = this.p * this.q;
//         const phi: bigint = (this.p -1n) * (this.q -1n);

        
//         //check to make sure e and phi n are coprime
//         let e: bigint;
//         do {
//             e = await this.generatePrime(32);
//         } while (gcd(e, phi) !== 1n);

//         //calculate inverse mod of e and phi 
//         const d = modInv(e, phi); 

//         this.publicKey = { e, n };
//         this.privateKey = { d, n };


//     }

//     //gcd calculator
//     private static gcdBigInt(a: bigint, b: bigint): bigint {
//         if (b === 0n) {
//             return a;
//         }
//         return this.gcdBigInt(b, a % b);
//     }

    public async signMessage(message: string, tAggregate: bigint): Promise<bigint> {
        //hashes message and transforms it into a big int
        this.hashTM = this.stringToMD5BigInt(tAggregate + message);

        // // calculates g*r^H(t,m)mod(n)
        // let expoMulti = this.privateKeyG * this.randInt ** hashTM

        // // let hashTM = BigInt(256849518824760635844157958915724147230)

        // // let expoMulti = this.randInt ** hashTM
        // this.sValue = expoMulti % this.publicKeyN

        this.sValue = this.privateKeyG * modPow(this.randInt, this.hashTM, this.publicKeyN);

        return this.sValue
        
    }

    private stringToMD5BigInt(message: string): bigint {
        // generates MD5 hash
        
        let hash = crypto.createHash('md5').update(message).digest('hex');
    
        // converts the MD5 hash to BigInt
        let hashBigInt = BigInt('0x' + hash);
    
        return hashBigInt;

    }
    
    
//     public verifySignature(message: string, signature: bigint, eValue: bigint, nValue: bigint): boolean {
//         //performs decryption calculation
//         let decryptedMessageBigInt = modPow(signature, eValue, nValue);
        
        

//         // prior to signing we hash the message and change it to a big int
//         // so here we need to do that to the message for comparison
//         // so that they are in the same form

//         let hashBigIntMessage = this.stringToMD5BigInt(message)

//         if (decryptedMessageBigInt === hashBigIntMessage){
//             return true;
//         }
//         else{
//             return false;
//         }
//     }
    


//     // getter methods:
        public getTvalue(): bigint {
            return this.tValue
        }

        public getRvalue(): bigint {
            return this.randInt
        }


    public getE(): bigint {
        return this.eValue
    }

    public getN(): bigint {
        return this.publicKeyN
    }

    public getG(): bigint {
        return this.privateKeyG
    }

    public getHash(): bigint {
        return this.hashTM
    }
//     public getPrivateKey(): { d: bigint; n: bigint } {
//         return this.privateKey;
//     }

//     public getP(): bigint {
//         return this.p;
//     }

//     public getQ(): bigint {
//         return this.q;
//     }

}