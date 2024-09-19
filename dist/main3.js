"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Inventory_1 = require("./Inventory");
const DigitalSignature2_1 = require("./DigitalSignature2");
const Block_1 = require("./Block");
const Blockchain_1 = require("./Blockchain");
//helper function to create an inventory and its signature
function createInventoryWithSignature(id, quantity, price, name) {
    const inventory = new Inventory_1.Inventory(id, quantity, price, name);
    const signature = new DigitalSignature2_1.DigitalSignature2();
    const blockchain = new Blockchain_1.Blockchain();
    return { inventory, signature, blockchain };
}
//function to sign a message by the signing inventory
function signMessage(inventory, signingSignature) {
    let message = inventory.getAll();
    let signedMessage = signingSignature.signMessage(message);
    let publicKey = signingSignature.getPublicKey();
    return { message, signedMessage, publicKey };
}
// function to allow other inventories to verify signature
function verifyMessage(inventories, message, signedMessage, publicKey) {
    return inventories.every(({ signature }) => signature.verifySignature(message, signedMessage, publicKey.e, publicKey.n));
}
// functino to add verified message to the block chain
function addToBlockChains(blockchains, message) {
    let currentDate = new Date().toLocaleDateString('en-AU');
    blockchains.forEach(blockchain => {
        blockchain.addBlock(new Block_1.Block(blockchain.chain.length, currentDate, message));
    });
}
function consensusCheck(blockchains) {
    for (let i = 0; i > blockchains.length; i++) {
        if (blockchains[i].chain[blockchains[i].chain.length - 1].nonce !==
            blockchains[0].chain[blockchains[0].chain.length - 1].nonce) {
            return false;
        }
    }
    return true;
}
async function main() {
    // Initialize inventories, signatures, and blockchains
    let inventories = [
        createInventoryWithSignature(4, 12, 400, "A"),
        createInventoryWithSignature(3, 22, 150, "B"),
        createInventoryWithSignature(2, 20, 230, "C"),
        createInventoryWithSignature(1, 32, 120, "D")
    ];
    // Wait for initialization to complete
    await new Promise(resolve => setTimeout(resolve, 10000));
    // Step 1: Inventory D signs the message
    let inventoryD = inventories[3];
    let { message, signedMessage, publicKey } = signMessage(inventoryD.inventory, inventoryD.signature);
    // Step 2: Other inventories verify the signed message
    let otherInventories = inventories.filter(inv => inv !== inventoryD);
    let isValid = verifyMessage(otherInventories, message, signedMessage, publicKey);
    // Step 3: If valid, add block to all blockchains
    if (isValid) {
        console.log("All inventories verify!");
        let blockchains = inventories.map(item => item.blockchain);
        addToBlockChains(blockchains, message);
        blockchains[2].chain[blockchains[2].chain.length - 1].nonce = 5;
        if (consensusCheck(blockchains)) {
            console.log("Consensus reached!");
        }
        else {
            console.log("Consensus failed!");
        }
    }
}
main().catch(err => console.error(err));
//# sourceMappingURL=main3.js.map