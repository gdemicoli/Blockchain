import { Inventory } from './Inventory';
import { IdentityDigitalSignature } from './IdentityDigitalSignature';
import { Block } from './Block';
import { Blockchain } from './Blockchain';
import { PublicKeyGenerator } from './PKG'
import * as crypto from 'crypto';
import { modPow } from 'bigint-crypto-utils';

//helper function to create an inventory and its t value
function createInventoryWithSignature(id: number, quantity: number, price: number, name: string, ) {

        const inventory = new Inventory(id, quantity, price, name);
        let signature = new IdentityDigitalSignature(PKG.addSigner(id), PKG.getE(), PKG.getN())
        const blockchain = new Blockchain();

        console.log("inventory " + inventory.getLocation())

        console.log("Values of each block in the chain at this point: ")

        blockchain.printChain()

        return { inventory, signature, blockchain };
}


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
    
    
    for(let i: number = 0; i < inventories.length; i++ ){
        console.log("Inventory " + inventories[i].inventory.getLocation() + "'s nonce value is: " + inventories[i].blockchain.chain[inventories[i].blockchain.chain.length-1].nonce)
        
            
    }

// Consensus 
    for(let i: number = 0; i < inventories.length; i++ ){
        
        if(inventories[i].blockchain.chain[inventories[i].blockchain.chain.length-1].nonce !==
             inventories[0].blockchain.chain[inventories[0].blockchain.chain.length-1].nonce)
             {
                consensus = false
            }
            
    }
    
    return consensus

}




//START HERE
async function printInventoryDetails(inventories: {inventory: Inventory, signature: IdentityDigitalSignature, blockchain: Blockchain} []) {
    
    console.log("Consensus check 1")
    consensusCheck(inventories)
    let tAggregate = PKG.computeAggregateT()
    let blockchains: Blockchain[] =[]

                
    
    

    
    let scenario = document.getElementById("scenario")
    scenario!.textContent = "Inventory initialisation"
    
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
        

        invList.appendChild(liDetails)
        invList.appendChild(liRvalue)
        invList.appendChild(liTCalculation)
        invList.appendChild(liTCalculation2)
        invList.appendChild(liTValue)
        invList.appendChild(liTValueInfo)
        invList.appendChild(liJCalculation)
        invList.appendChild(liJ2Calculation)
        
        scenario?.appendChild(invList)

    }

    for(let i = 0; i < inventories.length; i++){

        

        let blockchains: Blockchain[] =[]

                inventories.forEach(Element => {
                    blockchains.push(Element.blockchain)
                });
                
                let longestChain = findLongestChain(blockchains).chain.length


        let signatures :bigint[] =[]

        let inventoriesSign = document.createElement("div")
        inventoriesSign.innerHTML = "<strong>Inventory " + inventories[i].inventory.getLocation() + "s message signing & verification</strong>"

        let messageSigning = document.createElement("ol")
        let mSInfo = document.createElement("li")
        let mSInfo2 = document.createElement("li")

        mSInfo.textContent = "Inventory "+ inventories[i].inventory.getLocation() + " sends its information conatenated to all the other inventories " + inventories[i].inventory.getAll()
        mSInfo2.textContent = "The other inventories use it to sign and verify"
        

        messageSigning.appendChild(mSInfo)
        messageSigning.appendChild(mSInfo2)
        inventoriesSign.appendChild(messageSigning)

        scenario?.appendChild(inventoriesSign)

        let individualSigning = document.createElement("div")
        individualSigning.textContent = "Individual signing by each inventory"
        inventoriesSign.appendChild(individualSigning)


        for(let j =0; j < inventories.length; j++){
            
            let inventoriesSigning = document.createElement("ol")
            inventoriesSigning.textContent = "Inventory " + inventories[j].inventory.getLocation()

            let liSCalculation = document.createElement("li")
            let liSCalculation2 = document.createElement("li")
            let liSValue = document.createElement("li")
            let liSValue2 = document.createElement("li")

            liSCalculation.textContent =  "Then inventory " + inventories[j].inventory.getLocation() + 
                " calculates g * r ^ H(t,m) mod(n)"

            
                
                let signedMessage = await inventories[j].signature.signMessage(longestChain+ inventories[i].inventory.getAll(), tAggregate)
                
                signatures.push(signedMessage)

                liSCalculation2.textContent = "Which is: " + inventories[j].signature.getG() + " * " + inventories[j].signature.getRvalue() + " ^ " + inventories[j].signature.getHash() +
                " mod " + inventories[j].signature.getN()

                liSValue.textContent = "s value: " + signedMessage

                liSValue2.textContent = "Inventory " + inventories[j].inventory.getLocation() + " sends the signature to all the other inventories"

                inventoriesSigning.appendChild(liSCalculation)
                inventoriesSigning.appendChild(liSCalculation2)
                inventoriesSigning.appendChild(liSValue)
                inventoriesSigning.appendChild(liSValue2)
                individualSigning.appendChild(inventoriesSigning)
        }

        // 6. multi sig generation
        invContent.textContent = "";

        let signingDetails = document.createElement("div")
            signingDetails.textContent = "Multi Signature Generation"

        for (let k =0; k < inventories.length; k++) {
            
            let multiSigInfo = document.createElement("ol")

            multiSigInfo.textContent = "Inventory " + inventories[k].inventory.getLocation()

            let liMSG = document.createElement("li")
            let liMSG2 = document.createElement("li")
            let liMSG3 = document.createElement("li")

            let multiSig:bigint = inventories[k].signature.findMultiSig(signatures)

            liMSG.textContent = "After inventory " + inventories[k].inventory.getLocation() + " recieves all of the signatures it computes their product, let that be j"
            liMSG2.textContent = "Then they compute: j mod n = mSig"
            liMSG3.textContent = "mSig = " + multiSig

            multiSigInfo.appendChild(liMSG)
            multiSigInfo.appendChild(liMSG2)
            multiSigInfo.appendChild(liMSG3)

            signingDetails.appendChild(multiSigInfo)
            inventoriesSign.appendChild(signingDetails)
        }

        // 7. verification & consensus
        let verificationDetails = document.createElement("div")
        verificationDetails.textContent = "Verification & Consensus"

        inventoriesSign?.appendChild(verificationDetails)
        
        let validated 
    //FINISH ME SIGNATURE VALIDATION FOR EACH INVENTORY
        for (let l = 0; l< inventories.length; l++) {

            let verificationList = document.createElement("ol")
            verificationList.textContent = "Inventory " + inventories[l].inventory.getLocation()

            let liVer = document.createElement("li")
            let liVer2 = document.createElement("li")
            let liVer3 = document.createElement("li")
            let liVer4 = document.createElement("li")

            liVer.textContent = "To get consensus and perform verification inventory " + inventories[l].inventory.getLocation() +
            "has to calculate s^e mod n = x"
            liVer2.textContent = "Which is: " + inventories[l].signature.getMultiSig() + " ^ " + inventories[l].signature.getE() + " mod " + inventories[l].signature.getN()
            liVer3. textContent = "Then inventory " + inventories[l].inventory.getLocation() + " has to calculate the product of all the ids of the inventories in the system let that = i"
            liVer4.textContent = "Then calculate i * t ^H(t,m) mod n"
            
            let confirmation = document.createElement("li")

            //Validation
            if (inventories[l].signature.sigValidation(PKG.getIDs(), PKG.getAggregateT())){
                confirmation.textContent = "Inventory " + inventories[l].inventory.getLocation() + " successfully validated. Inventory " + 
                inventories[l].inventory.getLocation() + " adds the record to their blockchain"

                

                console.log("inventory: " + inventories[l].inventory.getLocation() + " chain length is " + inventories[l].blockchain.chain.length)
                inventories[l].blockchain.addBlock(new Block(longestChain, inventories[i].inventory.getAll()))

                console.log("inventory: " +inventories[l].inventory.getLocation() + " places into its block chain " + longestChain + inventories[i].inventory.getAll())
                console.log("inventory: " + inventories[l].inventory.getLocation() + "s blockchain is updated")
                
                console.log("Values of each block in the chain at this point: ")

                inventories[l].blockchain.printChain()

                

            }
            else {
                confirmation.textContent = "Inventory " + inventories[l].inventory.getLocation() +" couldn't verify and reach consensus. "
            }


            verificationList.appendChild(liVer)
            verificationList.appendChild(liVer2)
            verificationList.appendChild(liVer3)
            verificationList.appendChild(liVer4)
            verificationList.appendChild(confirmation)

            verificationDetails.appendChild(verificationList)
        }
        
        consensusCheck(inventories)
            let nonceArray: string[] = []

            let consensusDiv = document.createElement("div")
            let consensusOl = document.createElement("ol")
            let liCon = document.createElement("li")
            let liCon2 = document.createElement("li")

            liCon.textContent = "Each inventory calculates the POW nonce value"
            liCon2.textContent = "They then compare them to ensure consensus is reached"
            for(let i: number = 0; i < inventories.length; i++ ){
                nonceArray.push("Inventory " + inventories[i].inventory.getLocation() + "'s nonce value is: " + inventories[i].blockchain.chain[inventories[i].blockchain.chain.length-1].nonce)
                
                    
            }
            consensusOl.appendChild(liCon)
            consensusOl.appendChild(liCon2)


            let li: Node
            nonceArray.forEach(element => { 
                
                li = document.createElement("li")
                li.textContent = element
                consensusOl?.appendChild(li)
                
            });
            
            let liCon3 = document.createElement("li")
            liCon3.textContent = "Consensus has been reached: " + consensusCheck(inventories)
            consensusOl.appendChild(liCon3)

            consensusDiv.appendChild(consensusOl)

            verificationDetails.appendChild(consensusDiv)
            
        
    }
    //retrieves consensus
   
}


async function printSingleProcess(inventories: {inventory: Inventory, signature: IdentityDigitalSignature, blockchain: Blockchain} [], 
    updatedInv: {inventory: Inventory, signature: IdentityDigitalSignature, blockchain: Blockchain}) {
        
        let blockchains: Blockchain[] =[]

                inventories.forEach(Element => {
                    blockchains.push(Element.blockchain)
                });
                
                let longestChain = findLongestChain(blockchains).chain.length

        
        let scenario = document.getElementById("scenario")
    
        let tAggregate = PKG.computeAggregateT()
        let signatures :bigint[] =[]

        let inventoriesSign = document.createElement("div")
        inventoriesSign.innerHTML = "<strong>Inventory " + updatedInv.inventory.getLocation() + "s message signing & verification</strong>"

        let messageSigning = document.createElement("ol")
        let mSInfo = document.createElement("li")
        let mSInfo2 = document.createElement("li")

        mSInfo.textContent = "Inventory "+ updatedInv.inventory.getLocation() + " sends its information conatenated to all the other inventories " + updatedInv.inventory.getAll()
        mSInfo2.textContent = "The other inventories use it to sign and verify"
        

        messageSigning.appendChild(mSInfo)
        messageSigning.appendChild(mSInfo2)
        inventoriesSign.appendChild(messageSigning)

        scenario?.appendChild(inventoriesSign)

        let individualSigning = document.createElement("div")
        individualSigning.textContent = "Individual signing by each inventory"
        inventoriesSign.appendChild(individualSigning)


        for(let j =0; j < inventories.length; j++){
            
            let inventoriesSigning = document.createElement("ol")
            inventoriesSigning.textContent = "Inventory " + inventories[j].inventory.getLocation()

            let liSCalculation = document.createElement("li")
            let liSCalculation2 = document.createElement("li")
            let liSValue = document.createElement("li")
            let liSValue2 = document.createElement("li")

            liSCalculation.textContent =  "Then inventory " + inventories[j].inventory.getLocation() + 
                " calculates g * r ^ H(t,m) mod(n)"

            
                let signedMessage = await inventories[j].signature.signMessage(longestChain+ updatedInv.inventory.getAll(), tAggregate)
                
                signatures.push(signedMessage)

                liSCalculation2.textContent = "Which is: " + inventories[j].signature.getG() + " * " + inventories[j].signature.getRvalue() + " ^ " + inventories[j].signature.getHash() +
                " mod " + inventories[j].signature.getN()

                liSValue.textContent = "s value: " + signedMessage

                liSValue2.textContent = "Inventory " + inventories[j].inventory.getLocation() + " sends the signature to all the other inventories"

                inventoriesSigning.appendChild(liSCalculation)
                inventoriesSigning.appendChild(liSCalculation2)
                inventoriesSigning.appendChild(liSValue)
                inventoriesSigning.appendChild(liSValue2)
                individualSigning.appendChild(inventoriesSigning)
        }

        // 6. multi sig generation
        invContent.textContent = "";

        let signingDetails = document.createElement("div")
            signingDetails.textContent = "Multi Signature Generation"

        for (let k =0; k < inventories.length; k++) {
            
            let multiSigInfo = document.createElement("ol")

            multiSigInfo.textContent = "Inventory " + inventories[k].inventory.getLocation()

            let liMSG = document.createElement("li")
            let liMSG2 = document.createElement("li")
            let liMSG3 = document.createElement("li")

            let multiSig:bigint = inventories[k].signature.findMultiSig(signatures)

            liMSG.textContent = "After inventory " + inventories[k].inventory.getLocation() + " recieves all of the signatures it computes their product, let that be j"
            liMSG2.textContent = "Then they compute: j mod n = mSig"
            liMSG3.textContent = "mSig = " + multiSig

            multiSigInfo.appendChild(liMSG)
            multiSigInfo.appendChild(liMSG2)
            multiSigInfo.appendChild(liMSG3)

            signingDetails.appendChild(multiSigInfo)
            inventoriesSign.appendChild(signingDetails)
        }

        // 7. verification & consensus
        let verificationDetails = document.createElement("div")
        verificationDetails.textContent = "Verification & Consensus"

        inventoriesSign?.appendChild(verificationDetails)
            
    //FINISH ME SIGNATURE VALIDATION FOR EACH INVENTORY
        for (let l = 0; l< inventories.length; l++) {

            let verificationList = document.createElement("ol")
            verificationList.textContent = "Inventory " + inventories[l].inventory.getLocation()

            let liVer = document.createElement("li")
            let liVer2 = document.createElement("li")
            let liVer3 = document.createElement("li")
            let liVer4 = document.createElement("li")

            liVer.textContent = "To get consensus and perform verification inventory " + inventories[l].inventory.getLocation() +
            "has to calculate s^e mod n = x"
            liVer2.textContent = "Which is: " + inventories[l].signature.getMultiSig() + " ^ " + inventories[l].signature.getE() + " mod " + inventories[l].signature.getN()
            liVer3. textContent = "Then inventory " + inventories[l].inventory.getLocation() + " has to calculate the product of all the ids of the inventories in the system let that = i"
            liVer4.textContent = "Then calculate i * t ^H(t,m) mod n"
            
            let confirmation = document.createElement("li")

            //Concensus & validation, all inventories must have signed for the sig validation to return true, hence it is added.
            //as for consensus will still need to implement POW to ensure that everyone has the same chain
            if (inventories[l].signature.sigValidation(PKG.getIDs(), PKG.getAggregateT())){
                confirmation.textContent = "Inventory " + inventories[l].inventory.getLocation() + " successfully validated and reached consensus. Inventory " + 
                inventories[l].inventory.getLocation() + " adds the record to their blockchain"

                console.log("inventory: " + inventories[l].inventory.getLocation() + " chain length is " + inventories[l].blockchain.chain[inventories[l].blockchain.chain.length - 1])

                console.log("inventory: " + inventories[l].inventory.getLocation() + "s blockchain is updated")
                inventories[l].blockchain.addBlock(new Block(longestChain, updatedInv.inventory.getAll()))
                console.log("inventory: " + inventories[l].inventory.getLocation() + "s length of chain is " + inventories[l].blockchain.chain.length)

            }
            else {
                confirmation.textContent = "Inventory " + inventories[l].inventory.getLocation() +" couldn't verify and reach consensus. "
            }


            
            


            verificationList.appendChild(liVer)
            verificationList.appendChild(liVer2)
            verificationList.appendChild(liVer3)
            verificationList.appendChild(liVer4)
            verificationList.appendChild(confirmation)

            verificationDetails.appendChild(verificationList)



        }
        consensusCheck(inventories)
            let nonceArray: string[] = []

            let consensusDiv = document.createElement("div")
            let consensusOl = document.createElement("ol")
            let liCon = document.createElement("li")
            let liCon2 = document.createElement("li")

            liCon.textContent = "Each inventory calculates the POW nonce value"
            liCon2.textContent = "They then compare them to ensure consensus is reached"
            for(let i: number = 0; i < inventories.length; i++ ){
                nonceArray.push("Inventory " + inventories[i].inventory.getLocation() + "'s nonce value is: " + inventories[i].blockchain.chain[inventories[i].blockchain.chain.length-1].nonce)
                
                    
            }
            consensusOl.appendChild(liCon)
            consensusOl.appendChild(liCon2)


            let li: Node
            nonceArray.forEach(element => { 
                
                li = document.createElement("li")
                li.textContent = element
                consensusOl?.appendChild(li)
                
            });
            
            let liCon3 = document.createElement("li")
            liCon3.textContent = "Consensus has been reached: " + consensusCheck(inventories)
            consensusOl.appendChild(liCon3)

            consensusDiv.appendChild(consensusOl)

            verificationDetails.appendChild(consensusDiv)
        
        
        
}
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
    createInventoryWithSignature(3231265, 32, 120, "D"), 
    createInventoryWithSignature(5342532, 20, 230, "C"),
    createInventoryWithSignature(4526377, 22, 150, "B"),
    createInventoryWithSignature(514539878, 12, 400, "A")
    
    
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

    

    if (isNaN(quantity) || isNaN(price)) {
        alert("Please enter a valid number for Quantity and Price.");
        return; 
    }

    
    if (location === "") {
        alert("Please fill in all fields.");
        return; 
    }


    let updatedInv: {inventory: Inventory, signature: IdentityDigitalSignature, blockchain: Blockchain }
    for(let i = 0; i < inventories.length; i++) {
        if(location === inventories[i].inventory.getLocation()){

            inventories[i].inventory.updatePrice(price)
            inventories[i].inventory.updateQuantity(quantity)
            updatedInv = inventories[i]

            
        }
    }


    await new Promise<void>(resolve => setTimeout(resolve, 5000)); 
    // wait for initialization to complete

    
    inventoryDiv.innerHTML = "";


    // printInventoryDetails(inventories)
    
    printSingleProcess(inventories, updatedInv!)

    console.log("Length of inventory A's chain: " + inventories[3].blockchain.chain.length + " (including genesis block)")

   
});