import * as crypto from 'crypto';
// ledger that holds all records of 
export class Block {
    constructor(index, data, previousHash = '') {
        this.nonce = 0;
        this.index = index;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.createHash();
    }
    createHash() {
        //creates a hash of the block
        let formattedIndex = this.index.toString();
        return crypto.createHash('md5').update(formattedIndex + this.previousHash + this.data + this.nonce).digest('hex').toString();
    }
    mineBlock(numZeroes) {
        while (this.hash.substring(0, numZeroes) !== Array(numZeroes + 1).join("0")) {
            this.nonce++;
            this.hash = this.createHash();
        }
        console.log("Block mined: " + this.hash);
    }
}
//# sourceMappingURL=Block.js.map