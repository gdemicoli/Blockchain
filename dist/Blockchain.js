"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Block_1 = require("./Block");
const Inventory_1 = require("./Inventory");
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock() {
        return new Block_1.Block(0, "01/01/2024", "Genesis");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.createHash();
        this.chain.push(newBlock);
    }
    isChainValid() {
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
let testChain = new Blockchain();
let inventoryD = new Inventory_1.Inventory(1, 32, 120, "D");
testChain.addBlock(new Block_1.Block(1, "19/9/2024", inventoryD.getAll()));
let inventoryC = new Inventory_1.Inventory(2, 20, 230, "C");
testChain.addBlock(new Block_1.Block(2, "19/9/2024", inventoryC.getAll()));
let inventoryB = new Inventory_1.Inventory(3, 22, 150, "B");
testChain.addBlock(new Block_1.Block(3, "19/9/2024", inventoryB.getAll()));
// console.log(JSON.stringify(testChain, null, 4));
// console.log(testChain.chain[testChain.chain.length-1].hash)
console.log("Chain is valis: " + testChain.isChainValid());
//# sourceMappingURL=Blockchain.js.map