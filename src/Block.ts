import * as crypto from 'crypto';
import { Inventory } from './Inventory';

// ledger that holds all records of 
export class Block {
    index: number;
    time: string
    data: string;
    previousHash: string;
    hash: string;

    constructor (index: number, time: string, data: string, previousHash: string = ''){
        this.index = index;
        this.time = time;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.createHash()
        

    }

    createHash(): string {
        //creates a hash of the block
        let formattedIndex: string = this.index.toString()
        return crypto.createHash('md5').update(formattedIndex + this.previousHash+ this.time + this.data).digest('hex').toString()
    }


}

