"use strict";
// workflow:
// Inventory is created
// data is hashed
// signature is sent
Object.defineProperty(exports, "__esModule", { value: true });
// import * as crypto from 'crypto';
const Inventory_1 = require("./Inventory");
const DigitalSignature_1 = require("./DigitalSignature");
// function stringToHash(input: string): Buffer {
//     // creates hash opeject
//     let hashType: crypto.Hash = crypto.createHash('md5');
//     // updates the hash object with the input string
//     hashType.update(input);
//     // Get the hash digest as a hex string
//     let hash: Buffer = hashType.digest();
//     // Return the resulting hash
//     return hash;
// }
// Create inventories with their data
let inventoryA = new Inventory_1.Inventory(4, 12, 400, 'A');
let inventoryASignature = new DigitalSignature_1.DigitalSignature();
let message = inventoryA.getAll();
let signedMessage = inventoryASignature.signMessage(inventoryA.getAll());
console.log(signedMessage);
let isLegit = inventoryASignature.verifyMessage(message, signedMessage);
console.log(isLegit);
//# sourceMappingURL=main.js.map