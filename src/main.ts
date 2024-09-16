// workflow:
// Inventory is created
// data is hashed
// signature is sent

import { Inventory } from './Inventory';
import { DigitalSignature } from './DigitalSignature';


//inventoryA
// 1. Create inventories with their data
let inventoryA = new Inventory(4, 12, 400, 'A');

// 2. Create a digital signature for the inventory & retrieve the public key
let inventoryASignature = new DigitalSignature();
let inventoryAPK = inventoryASignature.getPubliceKey();

// 3. Create message to be signed by inventory
let message: string = inventoryA.getAll()

// 4. Sign the message
let signedMessage: string = inventoryASignature.signMessage(inventoryA.getAll());


console.log(signedMessage);

//5. Check the message
let isLegit: boolean = inventoryASignature.verifyMessage(message, signedMessage )

console.log(isLegit)







