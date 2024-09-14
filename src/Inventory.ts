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

    displayId(){
        return this.id
    }

}