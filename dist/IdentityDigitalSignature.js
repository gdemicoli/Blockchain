import { prime, modPow } from 'bigint-crypto-utils';
import * as crypto from 'crypto';
//when created: creates public and private keys which are permanent
//Has a method to take a message and signs it
//RSA implementation
export class IdentityDigitalSignature {
    //3. FIX ME remove rand seed page 6
    constructor(privateKey, eValue, nValue, randSeed) {
        //5. FIX ME remove  if else block for rand seed
        if (randSeed !== undefined) {
            let randomNums = [124524, 117623, 156253];
            this.privateKeyG = privateKey;
            this.eValue = eValue;
            this.publicKeyN = nValue;
            this.randInt = BigInt(randomNums[randSeed]);
            this.tValue = modPow(this.randInt, this.eValue, this.publicKeyN);
        }
        else {
            this.privateKeyG = privateKey;
            this.eValue = eValue;
            this.publicKeyN = nValue;
            this.init().then(() => {
                this.tValue = modPow(this.randInt, this.eValue, this.publicKeyN);
            });
        }
    }
    async init() {
        //generate p & q prime numbers
        this.randInt = await this.generatePrime(20);
    }
    async generatePrime(bits) {
        // Generate a prime number with the specified number of bits
        let primeNumber = await prime(bits);
        return primeNumber;
    }
    async signMessage(message, tAggregate) {
        //hashes message and transforms it into a big int
        this.hashTM = this.stringToMD5BigInt(tAggregate + message);
        // // console.log("Hash TM: " + this.hashTM)
        // this.hashTM = (tAggregate+ BigInt(10))
        // FIX ME 6 REMOVE HARDCODED HASH VALUE if everything works suspected issue probably lies here with hash to big int conversion
        // let hashArray: bigint[] = [291695778141170921277911006969911971888n, 291614778133170921277911006969911971888n, 3546876432414778133170921277911006969911971888n, 414778133170921277911006969911971888n]
        // const randomIndex = Math.floor(Math.random() * hashArray.length);
        // this.hashTM = hashArray[randomIndex];
        // this.hashTM = 291695778141170921277911006969911971888n
        // finding s value (Truly humble under god)
        this.sValue = (this.privateKeyG % this.publicKeyN) * modPow(this.randInt, this.hashTM, this.publicKeyN) % this.publicKeyN;
        return this.sValue;
    }
    stringToMD5BigInt(message) {
        // generates MD5 hash
        let hash = crypto.createHash('md5').update(message).digest('hex');
        // converts the MD5 hash to BigInt
        let hashBigInt = BigInt('0x' + hash);
        return hashBigInt;
    }
    findMultiSig(sigs) {
        let productSigs = BigInt(1);
        sigs.forEach(signature => {
            productSigs = productSigs * signature;
        });
        this.multiSig = modPow(productSigs, 1, this.publicKeyN);
        return this.multiSig;
    }
    sigValidation(ids, aggregateT) {
        let firstVal = modPow(this.multiSig, this.eValue, this.publicKeyN);
        let idProduct = BigInt(1);
        ids.forEach(id => {
            idProduct = idProduct * BigInt(id);
        });
        let secondVal = (idProduct % this.publicKeyN) * modPow(aggregateT, this.hashTM, this.publicKeyN) % this.publicKeyN;
        console.log("id product is: " + idProduct);
        console.log("first Value is: " + firstVal);
        console.log("second Value is: " + secondVal);
        if (firstVal === secondVal) {
            return true;
        }
        return false;
    }
    //     // getter methods:
    getTvalue() {
        return this.tValue;
    }
    getRvalue() {
        return this.randInt;
    }
    getE() {
        return this.eValue;
    }
    getN() {
        return this.publicKeyN;
    }
    getG() {
        return this.privateKeyG;
    }
    getHash() {
        return this.hashTM;
    }
    getS() {
        return this.sValue;
    }
    getMultiSig() {
        return this.multiSig;
    }
}
//# sourceMappingURL=IdentityDigitalSignature.js.map