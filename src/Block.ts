import * as crypto from 'crypto';
import { Inventory } from './Inventory';

// ledger that holds all records of 
export class Block {
    index: number;
    
    data: string;
    previousHash: string;
    hash: string;
    nonce:number = 0

    constructor (index: number, data: string, previousHash: string = ''){
        this.index = index;
        
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.createHash()

    }

    createHash(): string {
        //creates a hash of the block
        let formattedIndex: string = this.index.toString()
        return crypto.createHash('md5').update(formattedIndex + this.previousHash + this.data + this.nonce).digest('hex').toString()
    }

    mineBlock(numZeroes: number){
        
        while(this.hash.substring(0, numZeroes) !== Array(numZeroes + 1).join("0")) {
            this.nonce++;
            this.hash = this.createHash();

        }

        console.log("Block mined: " + this.hash);
    }


}

