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
    private multiSig!: bigint
    
    //3. FIX ME remove rand seed page 6
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

   

    public async signMessage(message: string, tAggregate: bigint): Promise<bigint> {
        //hashes message and transforms it into a big int
        this.hashTM = this.stringToMD5BigInt(tAggregate + message);

        // finding s value (Truly humble under god)
        this.sValue = (this.privateKeyG % this.publicKeyN) * modPow(this.randInt, this.hashTM, this.publicKeyN) % this.publicKeyN;

        return this.sValue
        
    }

    private stringToMD5BigInt(message: string): bigint {
        // generates MD5 hash
        
        let hash = crypto.createHash('md5').update(message).digest('hex');
    
        // converts the MD5 hash to BigInt
        let hashBigInt = BigInt('0x' + hash);
    
        return hashBigInt;

    }

        
    findMultiSig(sigs: bigint[]) {

        let productSigs: bigint = BigInt(1)

        sigs.forEach(signature => {
            productSigs = productSigs * signature
            
        });

        this.multiSig = modPow (productSigs, 1, this.publicKeyN)

        return this.multiSig

    }

    sigValidation(ids: number [], aggregateT: bigint):boolean {
        let firstVal = modPow(this.multiSig, this.eValue, this.publicKeyN)
        
        let idProduct:bigint = BigInt(1)
        ids.forEach(id => {
            idProduct = idProduct * BigInt(id)         
        });

        let secondVal = (idProduct % this.publicKeyN) * modPow(aggregateT, this.hashTM, this.publicKeyN) % this.publicKeyN;


        

        if(firstVal === secondVal) {
            return true
        }
        return false

    }

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

    public getS(): bigint {
        return this.sValue
    }

    public getMultiSig(): bigint {
        return this.multiSig
    }

    

}