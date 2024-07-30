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
            _id: false,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
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