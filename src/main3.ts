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

        

        blockchain.printChain()

        return { inventory, signature, blockchain };
}


// Functino to check for consensus across block chains
function consensusCheck(inventories: { inventory: Inventory; signature: IdentityDigitalSignature; blockchain: Blockchain }[]): boolean {

    let consensus: boolean = true
    let nonceArray: string[] = []

    let scenario = document.getElementById("scenario")
    
    
    

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

        mSInfo.textContent = "Inventory "+ inventories[i].inventory.getLocation() + " sends its information conatenated to all the other inventories " + longestChain + inventories[i].inventory.getAll() +
        " (the first number represent the number of records added to the blockchain plus one, a tally to prevent duplicate entries)"
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
    //SIGNATURE VALIDATION FOR EACH INVENTORY
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
                
                inventories[l].blockchain.addBlock(new Block(longestChain, inventories[i].inventory.getAll()))

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
        

        mSInfo.textContent = "Inventory "+ updatedInv.inventory.getLocation() + " sends its information conatenated to all the other inventories " +  longestChain +updatedInv.inventory.getAll() + 
        " (the first number represents the number of records added to the blockchain plus one, a tally to prevent duplicate entries)"
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

            
                let signedMessage = await inventories[j].signature.signMessage(longestChain + updatedInv.inventory.getAll(), tAggregate)
                
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
                confirmation.textContent = "Inventory " + inventories[l].inventory.getLocation() + " successfully validated. Inventory " + 
                inventories[l].inventory.getLocation() + " adds the record to their blockchain"

                

                console.log("inventory: " + inventories[l].inventory.getLocation() + "s blockchain is updated")
                inventories[l].blockchain.addBlock(new Block(longestChain, updatedInv.inventory.getAll()))
                

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


async function searchAndSign(inventories: {inventory: Inventory, signature: IdentityDigitalSignature, blockchain: Blockchain} [], 
    query: string, id: number): Promise <bigint> {
        // Each inventory searches through their block chain to look for the search quer
        let dataFound: boolean
        let sigs: bigint[] = []

        let searchDiv = document.createElement("div")
            let searchOl = document.createElement("ol")
            let liSearch = document.createElement("li")
            let liSearch2 = document.createElement("li")
            let liSearch3 = document.createElement("li");
            

            searchOl.innerHTML = "<strong>Your Search</strong>"
            liSearch.textContent = "Your query concatenated as a string: " + query
            liSearch2.textContent = "Each inventory searches their block chain for the data"
            
           


            searchOl.appendChild(liSearch)
            searchOl.appendChild(liSearch2)
            searchOl.appendChild(liSearch3)
            searchDiv.appendChild(searchOl)



            for (const inventory of inventories) {
                dataFound = false;

                let liSearch9 = document.createElement("li");
                let liSearch10 = document.createElement("li");

                liSearch9.textContent = "Inventory " + inventory.inventory.getLocation() + " searches through their block chain for your query"
                liSearch10.textContent = "They then append the result of the search with the mesage in the signing function g * r ^ H(t,m & searchResult) mod(n)"

                searchOl.appendChild(liSearch9)

                // Searches through blockchain
                for (let i = 0; i < inventory.blockchain.chain.length; i++) {
                    if (inventory.blockchain.chain[i].data === query && id === inventory.blockchain.chain[i].index) {
                        dataFound = true;
                        
                        

                        break;
                    }
                }
            
                // Signs the result of the search with the message
                
                let sig = await inventory.signature.signMessage(dataFound.toString() + query, PKG.getAggregateT());
                
                sigs.push(sig);
            }

            
            

        let liSearch4 = document.createElement("li")
        liSearch4.textContent = "These signatures are combined using the multi signature function (s1 * s2 * s3 *s4) mod n = mSig"
        searchOl.appendChild(liSearch4)

        let multiSig = inventories[0].signature.findMultiSig(sigs);

        let liSearch5 = document.createElement("li")
        let liSearch6 = document.createElement("li")
        let liSearch7 = document.createElement("li")
        let liSearch8 = document.createElement("li")
        let liSearch11 = document.createElement("li")
        let liSearch12 = document.createElement("li")
        
        liSearch5.textContent = "The computed multi signature is: " + multiSig

        liSearch11.textContent = "The client then calculates multiSig^e mod n = x and (i1 * i2 * i3 * i4) * t ^H(t,m) mod n"


            // Compute first value of multi signature verification
        let firstVal = modPow(multiSig, PKG.getE(), PKG.getN())

        liSearch6.textContent = "The computed first value is: " + firstVal

        let ids = PKG.getIDs()
        let idProduct:bigint = BigInt(1)
        // CHECK HOW BOOLEAN CONVERTS TO STRING
        let hashTM = inventories[0].signature.stringToMD5BigInt( PKG.getAggregateT()+"true" + query)

            ids.forEach(id => {
                idProduct = idProduct * BigInt(id)         
            });

        let secondVal = (idProduct % PKG.getN()) * modPow(PKG.getAggregateT(), hashTM, PKG.getN()) % PKG.getN();

        liSearch7.textContent = "The computed second value is: " + secondVal

        
        // True if record exists in all blockchains
        if (firstVal === secondVal) {
            console.log(true)
            liSearch8.textContent = "Your query exists"
        }
        else {
            console.log(false)
            liSearch8.textContent = "Your does not query exist"
        }


        searchOl.appendChild(liSearch5)
        searchOl.appendChild(liSearch6)
        searchOl.appendChild(liSearch7)
        searchOl.appendChild(liSearch8)

        let scenario = document.getElementById("scenario")

        scenario?.appendChild(searchDiv)
        // Multi Signature component 
        return inventories[0].signature.findMultiSig(sigs);
    
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


// Creates and appends input fields for form
function createInputElement(name: string, placeholder: string, type: string): HTMLInputElement {
    const input = document.createElement("input");
    input.name = name;
    input.placeholder = placeholder;
    input.type = type;
    return input;
}

// Creates and appends dropdown options for inventory
function createInventorySelect(inventories: any[], label: string): HTMLSelectElement {
    const select = document.createElement("select");
    select.name = "Location";

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    placeholderOption.textContent = label;
    select.appendChild(placeholderOption);

    inventories.forEach((name) => {
        const option = document.createElement("option");
        option.value = name.inventory.getLocation();
        option.textContent = name.inventory.getLocation();
        select.appendChild(option);
    });

    return select;
}

// Creates a button element
function createButton(text: string, type: string = "submit"): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = text;
    return button;
}

// Appends input elements and button to form
function appendFormElements(form: HTMLFormElement, elements: HTMLElement[]): void {
    elements.forEach((element) => form.appendChild(element));
}

// When submit is clicked
async function handleAddRecordSubmit(event: Event, inventories: any[]): Promise<void> {
    event.preventDefault();

    const quantity = parseFloat(quantityInput.value);
    const price = parseFloat(priceInput.value);
    const location = locationInput.value;

    if (isNaN(quantity) || isNaN(price)) {
        alert("Please enter a valid number for Quantity and Price.");
        return;
    }

    if (location === "") {
        alert("Please fill in all fields.");
        return;
    }

    let updatedInv: { inventory: Inventory; signature: IdentityDigitalSignature; blockchain: Blockchain };
    for (let i = 0; i < inventories.length; i++) {
        if (location === inventories[i].inventory.getLocation()) {
            inventories[i].inventory.updatePrice(price);
            inventories[i].inventory.updateQuantity(quantity);
            updatedInv = inventories[i];
            break;
        }
    }

    await new Promise<void>((resolve) => setTimeout(resolve, 5000)); 

    inventoryDiv.innerHTML = "";
    printSingleProcess(inventories, updatedInv!);
    console.log("Length of inventory A's chain: " + inventories[3].blockchain.chain.length + " (including genesis block)");
}

// When search is clicked
async function handleSearchRecordSubmit(event: Event): Promise<void> {
    event.preventDefault();

    

    const id = parseFloat(idInput.value)
    const quantity = parseFloat(quantitySearch.value).toString()
    const price = parseFloat(priceSearch.value).toString()
    const location = locationSearch.value

    if (location === "") {
        alert("Please fill in all fields.");
        return;
    }
    let formattedQuery:string = quantity + price + location;
    let multiSig: bigint = await searchAndSign(inventories, formattedQuery, id);

}

// Creates and appends forms 
const userInput = document.getElementById("userInput") as HTMLElement;

// Add record form
const form = document.createElement("form");
form.innerHTML = "<strong>Add a record: </strong>";
const quantityInput = createInputElement("Quantity", "Enter Quantity", "number");
const priceInput = createInputElement("Price", "Enter Price", "number");
const locationInput = createInventorySelect(inventories, "Select an inventory");
const submitButton = createButton("Submit");

appendFormElements(form, [quantityInput, priceInput, locationInput, submitButton]);
userInput.appendChild(form);
form.addEventListener("submit", (event) => handleAddRecordSubmit(event, inventories));

// Search form
const searchForm = document.createElement("form");
searchForm.innerHTML = "<strong>Search for a record: </strong>";
const idInput = createInputElement("ID", "Enter ID (entry tally)", "number");
const quantitySearch = createInputElement("Quantity", "Enter Quantity", "number");
const priceSearch = createInputElement("Price", "Enter Price", "number");
const locationSearch = createInventorySelect(inventories, "Select an inventory");
const submitSearch = createButton("Search");

appendFormElements(searchForm, [idInput, quantitySearch, priceSearch, locationSearch, submitSearch]);
userInput.appendChild(searchForm);
searchForm.addEventListener("submit", handleSearchRecordSubmit);
