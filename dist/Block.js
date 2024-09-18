"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const crypto = __importStar(require("crypto"));
// ledger that holds all records of 
class Block {
    constructor(index, time, data, previousHash = '') {
        this.index = index;
        this.time = time;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.createHash();
    }
    createHash() {
        //create a hash of the block
        let formattedIndex = this.index.toString();
        //TO-DO transform this.data from variable to string
        return crypto.createHash('md5').update(formattedIndex + this.previousHash + this.time + this.data).digest('hex').toString();
    }
}
exports.Block = Block;
//# sourceMappingURL=Block.js.map