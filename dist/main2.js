"use strict";
// import { Inventory } from './Inventory';
// import { DigitalSignature2 } from './DigitalSignature2';
// import { Block } from './Block';
// import { Blockchain } from './Blockchain';
// //test for RSA 
// //inventoryB
// async function main() {
//     let inventoryA = new Inventory(4, 12, 400, "A")
//     let inventoryB = new Inventory(3, 22, 150, "B")
//     let inventoryC = new Inventory(2, 20, 230, "C")
//     let inventoryD = new Inventory(1, 32, 120, "D")
//     // create a digital signature for the inventory
//     let inventoryASignature = new DigitalSignature2();
//     let inventoryBSignature = new DigitalSignature2();
//     let inventoryDSignature = new DigitalSignature2();
//     let inventoryCSignature = new DigitalSignature2();
//     // create individual blockchain (ledger for all inventories)
//     let inventoryABlockchain = new Blockchain();
//     let inventoryBBlockchain = new Blockchain();
//     let inventoryCBlockchain = new Blockchain();
//     let inventoryDBlockchain = new Blockchain();
//     // waits for initialization to complete
//     await new Promise<void>((resolve) => {
//         setTimeout(() => {
//             resolve();
//         }, 4000); 
//     });
//     // get message & signed message
//     let inventoryDMessage: string = inventoryD.getAll()
//     let inventoryDSignedMessage = inventoryDSignature.signMessage(inventoryDMessage)
//     let inventoryDPubK = inventoryDSignature.getPublicKey();
//     let inventoryCPubK = inventoryCSignature.getPublicKey();
//     let verifyMessage: boolean = inventoryBSignature.verifySignature(inventoryDMessage, inventoryDSignedMessage, inventoryDPubK.e, inventoryDPubK.n)
//     if(verifyMessage) {
//         let currentDate = new Date();
//         let date = currentDate.toLocaleDateString('en-AU'); 
//         inventoryABlockchain.addBlock(new Block(inventoryABlockchain.chain.length, date, inventoryDMessage))
//         inventoryBBlockchain.addBlock(new Block(inventoryABlockchain.chain.length, date, inventoryDMessage))
//         inventoryCBlockchain.addBlock(new Block(inventoryABlockchain.chain.length, date, inventoryDMessage))
//         inventoryDBlockchain.addBlock(new Block(inventoryABlockchain.chain.length, date, inventoryDMessage))
//     }
// }
// main().catch(err => console.error(err));
//# sourceMappingURL=main2.js.map