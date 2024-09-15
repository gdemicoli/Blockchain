// workflow:
// Inventory is created
// data is hashed
// signature is sent

// import * as crypto from 'crypto';
import { Inventory } from './Inventory';
import { DigitalSignature } from './DigitalSignature';

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



// 1. Create inventories with their data
let inventoryA = new Inventory(4, 12, 400, 'A');

// 2. Create a digital signature for the inventory
let inventoryASignature = new DigitalSignature();

// 3. Create message to be signed by inventory
let message: string = inventoryA.getAll()

// 4. Sign the message
let signedMessage: string = inventoryASignature.signMessage(inventoryA.getAll());

console.log(signedMessage);

//5. Check the message
let isLegit: boolean = inventoryASignature.verifyMessage(message, signedMessage )

console.log(isLegit)




