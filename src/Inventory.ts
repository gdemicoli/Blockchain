


// Creates an inventory that holds the parameters (line of the ledger)
export class Inventory{
    private id: number;
    private quantity: number;
    private price: number;
    private location: string;
    

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

    getAll(): string {
        // combine all to hashable string
        let formattedId: string = this.id.toString().padStart(3, '0');

        return formattedId + this.quantity + this.price + this.location

    }

    // Setters
    updateId(id: number) {
        this.id = id
    }

    updateQuantity(quantity: number) {
        this.quantity = quantity
    }

    updatePrice(price: number){
        this.price = price
    }



}