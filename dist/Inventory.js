"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inventory = void 0;
// Creates an inventory that holds the parameters (line of the ledger)
class Inventory {
    constructor(id, quantity, price, location) {
        this.id = id;
        this.quantity = quantity;
        this.price = price;
        this.location = location;
    }
    //Getters
    getId() {
        return this.id;
    }
    getQuantity() {
        return this.quantity;
    }
    getPrice() {
        return this.price;
    }
    getLocation() {
        return this.location;
    }
    getAll() {
        // combine all to hashable string
        let formattedId = this.id.toString().padStart(3, '0');
        return formattedId + this.quantity + this.price + this.location;
    }
}
exports.Inventory = Inventory;
//# sourceMappingURL=Inventory.js.map