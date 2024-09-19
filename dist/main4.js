"use strict";
// import { Inventory } from './Inventory';
// import { DigitalSignature2 } from './DigitalSignature2';
// import { Block } from './Block';
// import { Blockchain } from './Blockchain';
// // Helper function to create an inventory and its signature
// function createInventoryWithSignature(id: number, quantity: number, price: number, name: string) {
//     const inventory = new Inventory(id, quantity, price, name);
//     const signature = new DigitalSignature2();
//     const blockchain = new Blockchain();
//     return { inventory, signature, blockchain };
// }
// // Function to sign a message by the signing inventory
// function signMessage(inventory, signingSignature) {
//     let message: string = inventory.getAll();
//     let signedMessage = signingSignature.signMessage(message);
//     let publicKey = signingSignature.getPublicKey();
//     return { message, signedMessage, publicKey };
// }
// // Function for other inventories to verify the signed message
// function verifyMessage(inventories, message, signedMessage, publicKey) {
//     return inventories.every(({ signature }) =>
//         signature.verifySignature(message, signedMessage, publicKey.e, publicKey.n)
//     );
// }
// // Function to add blocks to all blockchains
// function addBlockToAllChains(blockchains, message) {
//     let currentDate = new Date().toLocaleDateString('en-AU');
//     blockchains.forEach(blockchain => {
//         blockchain.addBlock(new Block(blockchain.chain.length, currentDate, message));
//     });
// }
// async function main() {
//     // Initialize inventories, signatures, and blockchains
//     let inventories = [
//         createInventoryWithSignature(4, 12, 400, "A"),
//         createInventoryWithSignature(3, 22, 150, "B"),
//         createInventoryWithSignature(2, 20, 230, "C"),
//         createInventoryWithSignature(1, 32, 120, "D")
//     ];
//     // Wait for initialization to complete
//     await new Promise<void>(resolve => setTimeout(resolve, 4000));
//     // Step 1: Inventory D signs the message
//     let inventoryD = inventories[3];
//     let { message, signedMessage, publicKey } = signMessage(inventoryD.inventory, inventoryD.signature);
//     // Step 2: Other inventories verify the signed message
//     let otherInventories = inventories.filter(inv => inv !== inventoryD); // Exclude signing inventory
//     let isValid = verifyMessage(otherInventories, message, signedMessage, publicKey);
//     // Step 3: If valid, add block to all blockchains
//     if (isValid) {
//         let blockchains = inventories.map(item => item.blockchain);
//         addBlockToAllChains(blockchains, message);
//     }
// }
// main().catch(err => console.error(err));
//# sourceMappingURL=main4.js.map