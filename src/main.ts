// workflow:
// Inventory is created
// data is hashed
// signature is sent

import { Inventory } from './Inventory';
import { DigitalSignature } from './DigitalSignature';
import { DigitalSignature2 } from './DigitalSignature2';


//inventoryA
// 1. Create inventories with their data
let inventoryA = new Inventory(4, 12, 400, 'A');

// 2. Create a digital signature for the inventory & retrieve the public key
let inventoryASignature = new DigitalSignature();
let inventoryAPK = inventoryASignature.getPublicKey();

// 3. Create message to be signed by inventory 
let message: string = inventoryA.getAll()
//!!Check if need to hash the message before signing!!

// 4. Sign the message
let signedMessage: string = inventoryASignature.signMessage(inventoryA.getAll());


console.log(signedMessage);

//5. Check the message
let isLegit: boolean = inventoryASignature.verifyMessage(message, signedMessage )

console.log(isLegit)


//test for RSA 
//inventoryB

async function main() {
    // create a digital signature for the inventory
    let inventoryBSignature = new DigitalSignature2();

    // waits for initialization to complete
    await new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, 2000); 
    });

    // retrieves and print the public key values
    let inventoryBPubK = inventoryBSignature.getPublicKey();
    console.log("Public Key: e = " + inventoryBPubK.e.toString() + ", n = " + inventoryBPubK.n.toString());

    // retrieves and print the private key values
    let inventoryBPrivK = inventoryBSignature.getPrivateKey();
    console.log("Private Key: d = " + inventoryBPrivK.d.toString() + ", n = " + inventoryBPrivK.n.toString());

}

main().catch(err => console.error(err));









