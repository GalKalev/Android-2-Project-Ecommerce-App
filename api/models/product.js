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
    url: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },

    isShiny: {
        type: Boolean,
        required: true
    },
    gender: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    abilities: {
        type: [String],
        required: true
    },
    moves: {
        type: [String],
        required: true
    },
    species: {
        type: String,
        required: true
    },
    stats: [{
        _id: false,
        hp: {
            type: Number,
            required: true
        },
        attack: {
            type: Number,
            required: true
        },
        defense: {
            type: Number,
            required: true
        },
        specialAttack: {
            type: Number,
            required: true
        },
        specialDefense: {
            type: Number,
            required: true
        },
        speed: {
            type: Number,
            required: true
        }
    }],
    types: {
        type: [String],
        required: true
    },

    // details: {
    //     type: mongoose.Schema.Types.Mixed,
    //     required:true
    // }, 

    createdAt: {
        type: Date,
        default: Date.now
    },


})

const Product = mongoose.model("Product", productSchema);
module.exports = Product;