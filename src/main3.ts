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

function consensusCheck(blockchains:Blockchain[]): boolean {
    for(let i: number = 0; i < blockchains.length; i++ ){
        if(blockchains[i].chain[blockchains[i].chain.length-1].nonce !==
             blockchains[0].chain[blockchains[0].chain.length-1].nonce){
                return false
            }
            
    }
    return true

}

async function main() {
    //initialize inventories, signatures, and blockchains
    console.log("Script (main) is running");
    let inventories = [
        createInventoryWithSignature(4, 12, 400, "A"),
        createInventoryWithSignature(3, 22, 150, "B"),
        createInventoryWithSignature(2, 20, 230, "C"),
        createInventoryWithSignature(1, 32, 120, "D")
    ];

    //html
    const version1Div = document.getElementById("version1")!;

    const inventoryHeader = document.createElement("h5");
    inventoryHeader.textContent = "Inventories: ";

    version1Div.appendChild(inventoryHeader)
    

    // wait for initialization to complete
    await new Promise<void>(resolve => setTimeout(resolve, 10000));

    //1: Inventory D signs the message
    let inventoryD = inventories[3];
    let { message, signedMessage, publicKey } = signMessage(inventoryD.inventory, inventoryD.signature);

    // 2: Other inventories verify the signed message
    let otherInventories = inventories.filter(inv => inv !== inventoryD); 
    let isValid = verifyMessage(otherInventories, message, signedMessage, publicKey);

    

    // 3: If valid, add block to all blockchains
    if (isValid) {

        console.log("All inventories verify!")

        let blockchains = inventories.map(item => item.blockchain);
        addToBlockChains(blockchains, message);

        blockchains[2].chain[blockchains[2].chain.length-1].nonce = 5

        if (consensusCheck(blockchains)) {
            console.log("Consensus reached!")
    
        }
        else {
            console.log("Consensus failed!")
        }
    }

    
    
}


console.log("Script (main) is running");
main().catch(err => console.error(err));
