function stringToHash(input: string) {

}

// Creates an inventory that holds the parameters (line of the ledger)
class Inventory{
    id: number;
    quantity: number;
    price: number;
    location: string;
    

    constructor (id: number, quantity: number, price: number, location: string){
        this.id = id;
        this.quantity = quantity;
        this.price = price;
        this.location = location;

    }

    

    //Getters
    getId(): number {
        return this.id
    }

    getQuantity(): number {
        return this.quantity
    }

    getPrice(): number {
        return this.price
    }

    getLocation(): string {
        return this.location
    }


}