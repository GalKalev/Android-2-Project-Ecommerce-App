const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema from mongoose

// Assuming Product is imported from './product'
const Product = require('./product');

// Define the schema for Pokémon
const pokemonSchema = new Schema({
    // Define Pokémon-specific fields here
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
        hp: {
            type: Number,
            required: true
        },
        attack: {
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
    }
});

// Create the 'Pokemon' model using the discriminator method on 'Product'
const Pokemon = Product.discriminator('Pokemon', pokemonSchema);

module.exports = Pokemon;
