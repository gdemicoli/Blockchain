import { Inventory } from './Inventory';
import { IdentityDigitalSignature } from './IdentityDigitalSignature';
import { Block } from './Block';
import { Blockchain } from './Blockchain';
import { PublicKeyGenerator } from './PKG'
import * as crypto from 'crypto';
import { modPow } from 'bigint-crypto-utils';

//helper function to create an inventory and its t value
function createInventoryWithSignature(id: number, quantity: number, price: number, name: string) {
    
    const inventory = new Inventory(id, quantity, price, name);
    let signature = new IdentityDigitalSignature(PKG.addSigner(id), PKG.getE(), PKG.getN())
    const blockchain = new Blockchain();
    


    return { inventory, signature, blockchain };
}

//function to sign a message by the signing inventory
// function signMessage(inventory: Inventory, signingSignature: IdentityDigitalSignature) {


//     let message: string = inventory.getAll();
//     let signedMessage = signingSignature.signMessage(message);
//     let publicKey = signingSignature.getPublicKey();
//     return { message, signedMessage, publicKey };
// }

// functino to add verified message to the block chain
function addToBlockChains(blockchains:Blockchain [], message: string) {
    let currentDate = new Date().toLocaleDateString('en-AU');
    blockchains.forEach(blockchain => {
        blockchain.addBlock(new Block(blockchain.chain.length, currentDate, message));
    });
}

// Functino to check for consensus across block chains
function consensusCheck(inventories: { inventory: Inventory; signature: IdentityDigitalSignature; blockchain: Blockchain }[]): boolean {

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
// function signVerifyAndAddToChains(inventories: { inventory: Inventory; signature: IdentityDigitalSignature; blockchain: Blockchain }[],
//      signee: { inventory: Inventory; signature: IdentityDigitalSignature; blockchain: Blockchain }) {
//     // 1: Inventory D signs the message
//     let { message, signedMessage, publicKey } = signMessage(signee.inventory, signee.signature);

    
    
//     let olScenario = document.createElement("ol");
//     let signingHTML = "Inventory " + signee.inventory.getLocation() + " concatenates their inventory information " + signee.inventory.getAll();
//     let signingHTML2 = "The messaged is hashed in md5: " + signee.signature.hash
//     let signingHTML21 = "The message is turned into a big int value (not a decimal conversion, but is a unique value and can be used for calculation)" 
//     let signingHTML22 = "The big int value of the message is: " + BigInt('0x' + signee.signature.hash) 
//     let signingHTML3 = "Then the message is signed using m^d mod(n)"
//     let signingHTML4 = "The signed message: " + signedMessage
    
//     let unsignHTML = "The other inventories each verify the message using s^e mod(n):"

//     // 2: Other inventories verify the signed message
//     let otherInventories = inventories.filter(inv => inv !== signee);
    
//     // Array of blockchains that accept then signature
//     let acceptedBlockchains: Blockchain[] =[]
    

//         otherInventories.forEach((recipient) => {
//             if(recipient.signature.verifySignature(message, signedMessage, publicKey.e, publicKey.n)){
//                 unsignHTML += "\n Inventory " + recipient.inventory.getLocation() + " has verified the signature."
//                 acceptedBlockchains.push(recipient.blockchain)

//             }
//             else {
//                 unsignHTML += "\n Inventory " + recipient.inventory.getLocation() + "could not verify the signature."
//             }    
//         })

//     acceptedBlockchains.push(signee.blockchain)

    

    
//     addToBlockChains(acceptedBlockchains, message);

//     let unsignHTML2 = "If the signature is successfully verified they add it to their ledger."

//     let liScenario = document.createElement("ol");
//     let liScenario2 = document.createElement("ol");
//     let liScenario21 = document.createElement("ol");
//     let liScenario22 = document.createElement("ol");
//     let liScenario3 = document.createElement("ol");
//     let liScenario4 = document.createElement("ol");
//     let liScenario5 = document.createElement("ol");
//     let liScenario6 = document.createElement("ol");

//     liScenario.textContent = signingHTML
//     liScenario2.textContent = signingHTML2
//     liScenario21.textContent = signingHTML21
//     liScenario22.textContent = signingHTML22
//     liScenario3.textContent = signingHTML3
//     liScenario4.textContent = signingHTML4
//     liScenario5.textContent = unsignHTML
//     liScenario6.textContent = unsignHTML2

//     olScenario.appendChild(liScenario)
//     olScenario.appendChild(liScenario2)
//     olScenario.appendChild(liScenario21)
//     olScenario.appendChild(liScenario22)
//     olScenario.appendChild(liScenario3)
//     olScenario.appendChild(liScenario4)
//     olScenario.appendChild(liScenario5)
//     olScenario.appendChild(liScenario6)

//     scenario?.appendChild(olScenario)

    

// }


//START HERE
async function printInventoryDetails(inventories: {inventory: Inventory, signature: IdentityDigitalSignature, blockchain: Blockchain} []) {
    
    let tAggregate = PKG.computeAggregateT()
    let signatures :bigint[] =[]

    console.log("agregate t value: " + tAggregate)

    let scenario = document.getElementById("scenario")
    
    // 5. individual signature generation
    for(let i: number =0; i < inventories.length; i++) {
        let invList = document.createElement("ul")
        invList.textContent = "Inventory " + inventories[i].inventory.getLocation()
        inventoryDiv.appendChild(invList)

        // HTML text format for output
        let invDetails = "ID: " + inventories[i].inventory.getId() + " | Quantity: "+ inventories[i].inventory.getQuantity() +
        " | Price: " + inventories[i].inventory.getPrice() + " | Location: " + inventories[i].inventory.getLocation();

        
        // List item creation
        let liDetails = document.createElement("li")
        let liRvalue = document.createElement("li")
        let liTCalculation = document.createElement("li")
        let liTCalculation2 = document.createElement("li")
        let liTValue = document.createElement("li")
        let liTValueInfo = document.createElement("li")
        let liJCalculation = document.createElement("li")
        let liJ2Calculation = document.createElement("li")
        let liSCalculation = document.createElement("li")
        let liSCalculation2 = document.createElement("li")
        let liSValue = document.createElement("li")
        let liSValue2 = document.createElement("li")
        
        

        liDetails.textContent =  invDetails;
        liRvalue.textContent = "random number value: " + inventories[i].signature.getRvalue();
        liTCalculation.textContent =  "Inventory " + inventories[i].inventory.getLocation() +
        " calculates r^e mod(n) = t"
        liTCalculation2.textContent = "Does: " + inventories[i].signature.getRvalue() + " ^ " + inventories[i].signature.getE() + " mod " + inventories[i].signature.getN()
        liTValue.textContent =  "t value: " + inventories[i].signature.getTvalue().toString();

        
        liTValueInfo.textContent =  "This value is sent to all the other inventories so that they can calculate the aggregated t value";
        liJCalculation.textContent =  "Once all t values have been sent and recieved inventory " +
        inventories[i].inventory.getLocation() + " computes the aggregate t value by multiplying all the t values together, let that = j."
        liJ2Calculation.textContent = "Then computing j mod(n) = aT"
        liSCalculation.textContent =  "Then inventory " + inventories[i].inventory.getLocation() + 
        " calculates g * r ^ H(t,m) mod(n)"
        
        
        let signedMessage = await inventories[i].signature.signMessage(inventories[i].inventory.getAll(), tAggregate)
        
        signatures.push(signedMessage)

        liSCalculation2.textContent = "Which is: " + inventories[i].signature.getG() + " * " + inventories[i].signature.getRvalue() + " ^ " + inventories[i].signature.getHash() +
        " mod " + inventories[i].signature.getN()

        liSValue.textContent = "s value: " + signedMessage

        liSValue2.textContent = "Inventory " + inventories[i].inventory.getLocation() + " sends the signature to all the other inventories"

        invList.appendChild(liDetails)
        invList.appendChild(liRvalue)
        invList.appendChild(liTCalculation)
        invList.appendChild(liTCalculation2)
        invList.appendChild(liTValue)
        invList.appendChild(liTValueInfo)
        invList.appendChild(liJCalculation)
        invList.appendChild(liJ2Calculation)
        invList.appendChild(liSCalculation)
        invList.appendChild(liSCalculation2)
        invList.appendChild(liSValue)
        invList.appendChild(liSValue2)
        scenario?.appendChild(invList)

    }



    // 6. multi sig generation
    invContent.textContent = "";

    let signingDetails = document.createElement("div")
        signingDetails.textContent = "Multi Signature Generation"

    for (let i =0; i < inventories.length; i++) {
        
        let multiSigInfo = document.createElement("ol")

        multiSigInfo.textContent = "Inventory " + inventories[i].inventory.getLocation()

        let liMSG = document.createElement("li")
        let liMSG2 = document.createElement("li")
        let liMSG3 = document.createElement("li")

        let multiSig:bigint = inventories[i].signature.findMultiSig(signatures)

        liMSG.textContent = "After inventory " + inventories[i].inventory.getLocation() + " recieves all of the signatures it computes their product, let that be j"
        liMSG2.textContent = "Then they compute: j mod n = mSig"
        liMSG3.textContent = "mSig = " + multiSig

        multiSigInfo.appendChild(liMSG)
        multiSigInfo.appendChild(liMSG2)
        multiSigInfo.appendChild(liMSG3)

        signingDetails.appendChild(multiSigInfo)
        scenario?.appendChild(signingDetails)
    }

    // 7. verification & consensus
    let verificationDetails = document.createElement("div")
        
//FINISH ME SIGNATURE VALIDATION FOR EACH INVENTORY
    // for (let i = 0; i< inventories.length; i++) {

    //     let verificationList = document.createElement("ol")
    //     verificationList.textContent = "Verification & Consensus"
    //     verification.textContent = "Inventory " + inventories[i].inventory.getLocation()


    // }

}

// function printProcess(inventories: {inventory: Inventory, signature: IdentityDigitalSignature, blockchain: Blockchain} []) {

//     const signAndVerify = document.createElement("h4")

//     // start adding in html for scenario
//     signAndVerify.textContent = "Example Scenario:";

//     // 3: If valid, add block to all blockchains
//     for( let i = 0; i < inventories.length; i++) {
        
//         signVerifyAndAddToChains(inventories, inventories[i])

//             console.log("All inventories verify signature!")

            
//             if (consensusCheck(inventories)) {
//                 console.log("Consensus reached!")
        
//             }
//             else {
//                 console.log("Consensus failed!")
//             }
        
//     }
// }

// function printSingleProcess(inventories: {inventory: Inventory, signature: IdentityDigitalSignature, blockchain: Blockchain} []) {

//     let updatedInventory: {inventory: Inventory, signature: IdentityDigitalSignature, blockchain: Blockchain }
//     let highestID = 0

//     for(let i = 0; i < inventories.length; i++) {
//         if(highestID < inventories[i].inventory.getId()){
//             highestID = inventories[i].inventory.getId()
//             updatedInventory = inventories[i]
           
//         }
//     }
    
        
//         signVerifyAndAddToChains(inventories, updatedInventory!)

//         console.log("The n value of " + updatedInventory!.inventory.getLocation() + " is: " + updatedInventory!.signature.getPublicKey().n)
//         console.log("The e value of " + updatedInventory!.inventory.getLocation() + " is: " + updatedInventory!.signature.getPublicKey().e)
//         console.log("The d value of "  + updatedInventory!.inventory.getLocation() + " is: " + updatedInventory!.signature.getPrivateKey().d)
    

//             console.log("All inventories verify signature!")

            
//             if (consensusCheck(inventories)) {
//                 console.log("Consensus reached!")
        
//             }
//             else {
//                 console.log("Consensus failed!")
//             }
        
// }
function findLongestChain(blockchains: Blockchain[]): Blockchain {
    return blockchains.reduce((longest, current) => {
        return current.chain.length > longest.chain.length ? current : longest;
    }, blockchains[0]);  
}

    



//html
const version1Div = document.getElementById("version2")!;

const inventoryHeader = document.createElement("h5");
inventoryHeader.textContent = "Inventories: ";

version1Div.appendChild(inventoryHeader)

const inventoryDiv = document.createElement("div")
version1Div.appendChild(inventoryDiv)

// 1. initialise PKG
const PKG = new PublicKeyGenerator();

await new Promise<void>(resolve => setTimeout(resolve, 5000)); 

// 2. create inventories & thier t values
console.log("Script (main) is running");
let inventories = [
    createInventoryWithSignature(2, 32, 120, "D"),
    createInventoryWithSignature(3, 20, 230, "C"),
    createInventoryWithSignature(4, 22, 150, "B"),
    createInventoryWithSignature(5, 12, 400, "A")
    
    
];

let scenario = document.getElementById("scenario") as HTMLElement

    const invContent = document.createElement("p");
    invContent.textContent = "Inventory keys being generated, please wait..."

    inventoryDiv.appendChild(invContent)

    await new Promise<void>(resolve => setTimeout(resolve, 5000)); 

    // 3. Print PKG values
    const pkgList = document.createElement("ul")
    pkgList.textContent = "Public Key Generator";

    const pkgHTML = "PKG's public key n: " + PKG.getN()
    const pkgHTML2 = "PKG's public key e: " + PKG.getE()
    const pkgHTML3 = "PKG's private key d: " + PKG.getD()

    const pkgLi = document.createElement("li")
    const pkgLi2 = document.createElement("li")
    const pkgLi3 = document.createElement("li")

    pkgLi.textContent = pkgHTML
    pkgLi2.textContent = pkgHTML2
    pkgLi3.textContent = pkgHTML3

    pkgList.appendChild(pkgLi)
    pkgList.appendChild(pkgLi2)
    pkgList.appendChild(pkgLi3)

    version1Div.appendChild(pkgList)

   


    inventories.forEach(inventory => {

        console.log("t value: " + inventory.signature.getTvalue().toString())

        PKG.addTValue(inventory.signature.getTvalue())
        
    }); 

console.log("Script (main) is running");


 // 4. compute aggregate t value & pass to all inventories
printInventoryDetails(inventories).catch(err => console.error(err));

// printProcess(inventories)





// //user input fields
let userInput = document.getElementById("userInput") as HTMLElement;
let form = document.createElement("form");

let idInput = document.createElement("input");
idInput.name = "ID";
idInput.placeholder = "Enter ID";

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
    event.preventDefault();  
    
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


    // printInventoryDetails(inventories)
    
    // printSingleProcess(inventories)

    console.log("Length of inventory A's chain: " + inventories[3].blockchain.chain.length + " (including genesis block)")

   
});