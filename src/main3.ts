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
// function verifyMessage(inventories: {inventory: Inventory, signature: DigitalSignature2, blockchain: Blockchain},
//      message: string, signedMessage: bigint, publicKey:{e: bigint, n:bigint}) {
        
//     return inventories.every(({ signature }) =>
//         signature.verifySignature(message, signedMessage, publicKey.e, publicKey.n)
//     );
// }

// functino to add verified message to the block chain
function addToBlockChains(blockchains:Blockchain [], message: string) {
    let currentDate = new Date().toLocaleDateString('en-AU');
    blockchains.forEach(blockchain => {
        blockchain.addBlock(new Block(blockchain.chain.length, currentDate, message));
    });
}

// Functino to check for consensus across block chains
function consensusCheck(inventories: { inventory: Inventory; signature: DigitalSignature2; blockchain: Blockchain }[]): boolean {

    let consensus: boolean = true
    let nonceArray: string[] = []

    let scenario = document.getElementById("scenario")
    
    
// Consensus 
    for(let i: number = 0; i < inventories.length; i++ ){
        nonceArray.push("Inventory " + inventories[i].inventory.getLocation() + "'s nonce value is: " + inventories[i].blockchain.chain[inventories[i].blockchain.chain.length-1].nonce)
        
        if(inventories[i].blockchain.chain[inventories[i].blockchain.chain.length-1].nonce !==
             inventories[0].blockchain.chain[inventories[0].blockchain.chain.length-1].nonce)
             {
                consensus = false
            }
            
    }

    let ol: Node
    nonceArray.forEach(element => { 
        
        ol = document.createElement("ol")
        ol.textContent = element
        scenario?.appendChild(ol)
        
    });

    


    return consensus

}

// Helper function for initial inventories
function signVerifyAndAddToChains(inventories: { inventory: Inventory; signature: DigitalSignature2; blockchain: Blockchain }[],
     signee: { inventory: Inventory; signature: DigitalSignature2; blockchain: Blockchain }) {
    // 1: Inventory D signs the message
    let { message, signedMessage, publicKey } = signMessage(signee.inventory, signee.signature);

    
    
    let olScenario = document.createElement("ol");
    let signingHTML = "Inventory " + signee.inventory.getLocation() + " concatenates their inventory information " + signee.inventory.getAll();
    let signingHTML2 = "The messaged is hashed in md5: " + signee.signature.hash
    let signingHTML3 = "Then the message is signed using m^d mod(n)"
    let signingHTML4 = "The signed message is turned into a big int value (not a decimal conversion, but is a unique value and can be used for calculation) " + signedMessage
    
    let unsignHTML = "The other inventories each verify the message using s^e mod(n):"

    // 2: Other inventories verify the signed message
    let otherInventories = inventories.filter(inv => inv !== signee);
    
    // Array of blockchains that accept then signature
    let acceptedBlockchains: Blockchain[] =[]
    

        otherInventories.forEach((recipient) => {
            if(recipient.signature.verifySignature(message, signedMessage, publicKey.e, publicKey.n)){
                unsignHTML += "\n Inventory " + recipient.inventory.getLocation() + " has verified the signature."
                acceptedBlockchains.push(recipient.blockchain)

            }
            else {
                unsignHTML += "\n Inventory " + recipient.inventory.getLocation() + "could not verify the signature."
            }    
        })

    acceptedBlockchains.push(signee.blockchain)

    

    
    addToBlockChains(acceptedBlockchains, message);

    let unsignHTML2 = "If the signature is successfully verified they add it to their ledger."

    let liScenario = document.createElement("ol");
    let liScenario2 = document.createElement("ol");
    let liScenario3 = document.createElement("ol");
    let liScenario4 = document.createElement("ol");
    let liScenario5 = document.createElement("ol");
    let liScenario6 = document.createElement("ol");

    liScenario.textContent = signingHTML
    liScenario2.textContent = signingHTML2
    liScenario3.textContent = signingHTML3
    liScenario4.textContent = signingHTML4
    liScenario5.textContent = unsignHTML
    liScenario6.textContent = unsignHTML2

    olScenario.appendChild(liScenario)
    olScenario.appendChild(liScenario2)
    olScenario.appendChild(liScenario3)
    olScenario.appendChild(liScenario4)
    olScenario.appendChild(liScenario5)
    olScenario.appendChild(liScenario6)

    scenario?.appendChild(olScenario)

    

}


//START HERE
async function printInventoryDetails(inventories: {inventory: Inventory, signature: DigitalSignature2, blockchain: Blockchain} []) {
    

    
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
}

function printProcess(inventories: {inventory: Inventory, signature: DigitalSignature2, blockchain: Blockchain} []) {

    const signAndVerify = document.createElement("h4")

    // start adding in html for scenario
    signAndVerify.textContent = "Example Scenario:";

    // 3: If valid, add block to all blockchains
    for( let i = 0; i < inventories.length; i++) {
        
        signVerifyAndAddToChains(inventories, inventories[i])

            console.log("All inventories verify signature!")

            
            if (consensusCheck(inventories)) {
                console.log("Consensus reached!")
        
            }
            else {
                console.log("Consensus failed!")
            }
        
    }
}

function printSingleProcess(inventories: {inventory: Inventory, signature: DigitalSignature2, blockchain: Blockchain} []) {

    let updatedInventory: {inventory: Inventory, signature: DigitalSignature2, blockchain: Blockchain }
    let highestID = 0

    for(let i = 0; i < inventories.length; i++) {
        if(highestID < inventories[i].inventory.getId()){
            highestID = inventories[i].inventory.getId()
            updatedInventory = inventories[i]
           
        }
    }
    
        
        signVerifyAndAddToChains(inventories, updatedInventory!)

        console.log("The n value of " + updatedInventory!.inventory.getLocation() + " is: " + updatedInventory!.signature.getPublicKey().n)
        console.log("The e value of " + updatedInventory!.inventory.getLocation() + " is: " + updatedInventory!.signature.getPublicKey().e)
        console.log("The d value of "  + updatedInventory!.inventory.getLocation() + " is: " + updatedInventory!.signature.getPrivateKey().d)
    

            console.log("All inventories verify signature!")

            
            if (consensusCheck(inventories)) {
                console.log("Consensus reached!")
        
            }
            else {
                console.log("Consensus failed!")
            }
        
}
function findLongestChain(blockchains: Blockchain[]): Blockchain {
    return blockchains.reduce((longest, current) => {
        return current.chain.length > longest.chain.length ? current : longest;
    }, blockchains[0]);  
}

    



//html
const version1Div = document.getElementById("version1")!;

const inventoryHeader = document.createElement("h5");
inventoryHeader.textContent = "Inventories: ";

version1Div.appendChild(inventoryHeader)

const inventoryDiv = document.createElement("div")
version1Div.appendChild(inventoryDiv)



//initialize inventories, signatures, and blockchains
console.log("Script (main) is running");
let inventories = [
    createInventoryWithSignature(1, 32, 120, "D"),
    createInventoryWithSignature(2, 20, 230, "C"),
    createInventoryWithSignature(3, 22, 150, "B"),
    createInventoryWithSignature(4, 12, 400, "A")
    
    
];

let scenario = document.getElementById("scenario") as HTMLElement

const invContent = document.createElement("p");
    invContent.textContent = "Inventory keys being generated, please wait..."

    inventoryDiv.appendChild(invContent)

    await new Promise<void>(resolve => setTimeout(resolve, 5000)); 


console.log("Script (main) is running");
printInventoryDetails(inventories).catch(err => console.error(err));

printProcess(inventories)




//user input fields
let userInput = document.getElementById("userInput") as HTMLElement;
let form = document.createElement("form");

// let idInput = document.createElement("input");
// idInput.name = "ID";
// idInput.placeholder = "Enter ID";

let quantityInput = document.createElement("input");
quantityInput.name = "Quantity";
quantityInput.placeholder = "Enter Quantity";
quantityInput.type = "number";

let priceInput = document.createElement("input");
priceInput.name = "Price";
priceInput.placeholder = "Enter Price";
priceInput.type = "number";

let labelLocations = document.createElement("Label")
labelLocations.textContent = "Location/Name"
let locationInput = document.createElement("select");
locationInput.name = "Location";


const placeholderOption = document.createElement("option");
placeholderOption.value = "";
placeholderOption.disabled = true;
placeholderOption.selected = true;
placeholderOption.textContent = "Select an inventory";
locationInput.appendChild(placeholderOption);

// Create and the inventory options
inventories.forEach(name => {
    const option = document.createElement("option");
    option.value = name.inventory.getLocation()
    option.textContent = name.inventory.getLocation();
    locationInput.appendChild(option);
});


let submitButton = document.createElement("button");
submitButton.type = "submit";
submitButton.textContent = "Submit";

// form.appendChild(idInput);
form.appendChild(quantityInput);
form.appendChild(priceInput);
form.appendChild(locationInput);
form.appendChild(submitButton);


userInput.appendChild(form);

// Listen for form submission
form.addEventListener("submit", async (event) => {
    event.preventDefault();  // Prevent the form from submitting the traditional way
    
    // Retrieve values from the input fields
    
    let quantity: number = parseFloat(quantityInput.value)
    let price: number = parseFloat(priceInput.value)
    let location = locationInput.value;

    let id = 0

    for(let i = 0; i < inventories.length; i++) {
        if(inventories[i].inventory.getId() >= id) {
            id = inventories[i].inventory.getId() + 1
        }

    }

    if (isNaN(quantity) || isNaN(price)) {
        alert("Please enter a valid number for Quantity and Price.");
        return; 
    }

    
    if (location === "") {
        alert("Please fill in all fields.");
        return; 
    }



    for(let i = 0; i < inventories.length; i++) {
        if(location === inventories[i].inventory.getLocation()){
            inventories[i].inventory.updateId(id)
            inventories[i].inventory.updatePrice(price)
            inventories[i].inventory.updateQuantity(quantity)

            
        }
    }


    await new Promise<void>(resolve => setTimeout(resolve, 5000)); 
    // wait for initialization to complete

    
    inventoryDiv.innerHTML = "";


    printInventoryDetails(inventories)
    
    printSingleProcess(inventories)

   
});