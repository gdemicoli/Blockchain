import { Inventory } from './Inventory';
import { DigitalSignature2 } from './DigitalSignature2';
import { Block } from './Block';
import { Blockchain } from './Blockchain';


//helper function to create an inventory and its signature
function createInventoryWithSignature(id: number, quantity: number, price: number, name: string) {
    
    const inventory = new Inventory(id, quantity, price, name);
    const signature = new DigitalSignature2();
    const blockchain = new Blockchain();


    return { inventory, signature, blockchain };
}

//function to sign a message by the signing inventory
function signMessage(inventory: Inventory, signingSignature: DigitalSignature2) {
    let message: string = inventory.getAll();
    let signedMessage = signingSignature.signMessage(message);
    let publicKey = signingSignature.getPublicKey();
    return { message, signedMessage, publicKey };
}

// function to allow other inventories to verify signature
function verifyMessage(inventories: {inventory: Inventory, signature: DigitalSignature2, blockchain: Blockchain}[],
     message: string, signedMessage: bigint, publicKey:{e: bigint, n:bigint}) {
        
    return inventories.every(({ signature }) =>
        signature.verifySignature(message, signedMessage, publicKey.e, publicKey.n)
    );
}

// functino to add verified message to the block chain
function addToBlockChains(blockchains:Blockchain [], message: string) {
    let currentDate = new Date().toLocaleDateString('en-AU');
    blockchains.forEach(blockchain => {
        blockchain.addBlock(new Block(blockchain.chain.length, currentDate, message));
    });
}

// Functino to check for consensus across block chains
function consensusCheck(blockchains:Blockchain[]): boolean {
    for(let i: number = 0; i < blockchains.length; i++ ){
        if(blockchains[i].chain[blockchains[i].chain.length-1].nonce !==
             blockchains[0].chain[blockchains[0].chain.length-1].nonce){
                return false
            }
            
    }
    return true

}

// Helper function for initial inventories
function signVerifyAndAddToChains(inventories: { inventory: Inventory; signature: DigitalSignature2; blockchain: Blockchain }[],
     signee: { inventory: Inventory; signature: DigitalSignature2; blockchain: Blockchain }): boolean {
    // 1: Inventory D signs the message
    
    let { message, signedMessage, publicKey } = signMessage(signee.inventory, signee.signature);

    // 2: Other inventories verify the signed message
    let otherInventories = inventories.filter(inv => inv !== signee); 
    let isValid = verifyMessage(otherInventories, message, signedMessage, publicKey);

    let blockchains = inventories.map(item => item.blockchain);
    addToBlockChains(blockchains, message);


    return isValid

}



async function main() {

    //html
    const version1Div = document.getElementById("version1")!;

    const inventoryHeader = document.createElement("h5");
    inventoryHeader.textContent = "Inventories: ";

    version1Div.appendChild(inventoryHeader)

    const inventoryDiv = document.createElement("div")
    version1Div.appendChild(inventoryDiv)
    
    const invContent = document.createElement("p");
    invContent.textContent = "Inventory keys being generated, please wait..."

    inventoryDiv.appendChild(invContent)

    //initialize inventories, signatures, and blockchains
    console.log("Script (main) is running");
    let inventories = [
        createInventoryWithSignature(4, 12, 400, "A"),
        createInventoryWithSignature(3, 22, 150, "B"),
        createInventoryWithSignature(2, 20, 230, "C"),
        createInventoryWithSignature(1, 32, 120, "D")
    ];

    

    
    // wait for initialization to complete
    await new Promise<void>(resolve => setTimeout(resolve, 5000));

    for(let i: number =0; i < inventories.length; i++) {
        let invList = document.createElement("ul")
        invList.textContent = "Inventory " + inventories[i].inventory.getLocation()
        inventoryDiv.appendChild(invList)

        // HTML text format for output
        let invDetails = "ID: " + inventories[i].inventory.getId() + " | Quantity: "+ inventories[i].inventory.getQuantity() +
        " | Price: " + inventories[i].inventory.getPrice() + " | Location: " + inventories[i].inventory.getLocation();

        // Public key values
        let publicKeys = inventories[i].signature.getPublicKey();
        let invKeyN = "Public Key n: " + publicKeys.n;
        let invKeyE = "Public Key e: " + publicKeys.e

        // Private Key values
        let privateKeys = inventories[i].signature.getPrivateKey();
        let invKeyD = "Private Key d: " + privateKeys.d;
        let invKeyN2 = "Private Key n: " + privateKeys.n

        // List item creation
        let liDetails = document.createElement("li")
        let liKeyN = document.createElement("li")
        let liKeyE = document.createElement("li")
        let liKeyD = document.createElement("li")
        let liKeyN2 = document.createElement("li")
        

        liDetails.textContent = document.textContent = invDetails;
        liKeyN.textContent = document.textContent = invKeyN;
        liKeyE.textContent = document.textContent = invKeyE;
        liKeyD.textContent = document.textContent = invKeyD;
        liKeyN2.textContent = document.textContent = invKeyN;

        


      
        invList.appendChild(liDetails)
        invList.appendChild(liKeyN)
        invList.appendChild(liKeyE)
        invList.appendChild(liKeyD)
        invList.appendChild(liKeyN2)

    }

    invContent.textContent = "";

    const signAndVerify = document.createElement("h4")

    signAndVerify.textContent = "Protocol:";

    
    

    // 3: If valid, add block to all blockchains
    for( let i = 0; i < inventories.length; i++) {
        
        if (signVerifyAndAddToChains(inventories, inventories[i])) {

            console.log("All inventories verify signature!")

            let blockchains = inventories.map(item => item.blockchain);
            if (consensusCheck(blockchains)) {
                console.log("Consensus reached!")
        
            }
            else {
                console.log("Consensus failed!")
            }
        }
    }
    

    
    
}


console.log("Script (main) is running");
main().catch(err => console.error(err));
