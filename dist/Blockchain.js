"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
const Block_1 = require("./Block");
class Blockchain {
    constructor() {
        this.difficulty = 7;
        //builds genesis block on instantiation
        this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock() {
        return new Block_1.Block(0, "01/01/2024", "Genesis");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        //gets the hash of the previous block (latest block at the time) 
        // and sets that to the precious has of the new block
        newBlock.previousHash = this.getLatestBlock().hash;
        //creates a hash of the new block and pushes it to the array
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    isChainValid() {
        //checks to see if hashes are valid
        for (let i = 1; i < this.chain.length; i++) {
            let currentBlock = this.chain[i];
            let previousBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.createHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}
exports.Blockchain = Blockchain;
let testChain = new Blockchain();
// console.log("Mining first block...")
// let inventoryD = new Inventory(1, 32, 120, "D")
// testChain.addBlock(new Block(1, "19/9/2024", inventoryD.getAll()))
// console.log("Mining second block...")
// let inventoryC = new Inventory(2, 20, 230, "C")
// testChain.addBlock(new Block(2, "19/9/2024", inventoryC.getAll()))
// console.log("Mining third block...")
// let inventoryB = new Inventory(3, 22, 150, "B")
// testChain.addBlock(new Block(3, "19/9/2024", inventoryB.getAll()))
// console.log(JSON.stringify(testChain, null, 4));
// // console.log(testChain.chain[testChain.chain.length-1].hash)
// console.log("Chain is valid: " + testChain.isChainValid())
//# sourceMappingURL=Blockchain.js.map