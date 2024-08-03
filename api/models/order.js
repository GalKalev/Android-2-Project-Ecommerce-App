const { isRequired } = require('deprecated-react-native-prop-types/DeprecatedColorPropType');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            // _id: false,
            product: {
                _id:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:'Product',
                    required: true
                },
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

                createdAt: {
                    type: Date,
                    default: Date.now
                }},
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        region: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            require: true
        },
        houseNum:{
            type: String,
            required: true
        }
    },
    paymentDetails: {
        cardOwner:{
            type: String,
            required: true
        },
        cardNumber:{
            type: String,
            required: true
        },
        expirationDate:{
            type: String,
            required: true
        },
        cvv:{
            type: String,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order",orderSchema);

module.exports = Order;