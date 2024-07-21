const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    url:{
        type:String,
        required:true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },

    details: {
        type: mongoose.Schema.Types.Mixed,
        required:true
    }, 

    createdAt: {
        type: Date,
        default: Date.now
    },

    
})

const Product = mongoose.model("Product", productSchema);
module.exports = Product;