const mongoose = require('mongoose');

const baseOptions = {
    discriminatorKey: 'productType',
}

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        require: true
    },
    url:{
        type:String,
        require:true
    },
    price: {
        type: Number,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, baseOptions)

const Product = mongoose.model("Product", productSchema);
module.exports = Product;