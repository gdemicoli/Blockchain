import * as crypto from 'crypto';

// ledger that holds all records of 
export class Block {
    index: number;
    time: string
    data: string;
    previousHash: crypto.Hash;
    hash: crypto.Hash;

    constructor (index: number, time: string, data: string, previousHash: crypto.Hash){
        this.index = index;
        this.time = time;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.createHash()
        

    }

    createHash(): crypto.Hash {
        //create a hash of the block
        let formattedIndex = this.index.toString()
        //TO-DO transform this.data from variable to string
        return crypto.createHash('md5').update(formattedIndex + this.previousHash+ this.time + this.data)
    }


}

