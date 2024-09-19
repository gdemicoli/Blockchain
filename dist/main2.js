"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Inventory_1 = require("./Inventory");
const DigitalSignature2_1 = require("./DigitalSignature2");
//test for RSA 
//inventoryB
async function main() {
    let inventoryA = new Inventory_1.Inventory(4, 12, 400, "A");
    let inventoryB = new Inventory_1.Inventory(3, 22, 150, "B");
    let inventoryC = new Inventory_1.Inventory(2, 20, 230, "C");
    let inventoryD = new Inventory_1.Inventory(1, 32, 120, "D");
    // create a digital signature for the inventory
    let inventoryASignature = new DigitalSignature2_1.DigitalSignature2();
    let inventoryBSignature = new DigitalSignature2_1.DigitalSignature2();
    let inventoryDSignature = new DigitalSignature2_1.DigitalSignature2();
    let inventoryCSignature = new DigitalSignature2_1.DigitalSignature2();
    // waits for initialization to complete
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 4000);
    });
    // get message & signed message
    let inventoryDMessage = inventoryD.getAll();
    let inventoryDSignedMessage = inventoryDSignature.signMessage(inventoryDMessage);
    let inventoryDPubK = inventoryDSignature.getPublicKey();
    let inventoryCPubK = inventoryCSignature.getPublicKey();
    let verifyMessage = inventoryBSignature.verifySignature(inventoryDMessage, inventoryDSignedMessage, inventoryCPubK.e, inventoryDPubK.n);
    console.log(verifyMessage);
}
main().catch(err => console.error(err));
//# sourceMappingURL=main2.js.map