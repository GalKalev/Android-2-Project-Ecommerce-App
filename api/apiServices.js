import axios from 'axios';
import { IP_ADDRESS,PORT } from '@env';
import Toast from "react-native-toast-message";
import {Alert} from "react-native";
// const { PORT, IP_ADDRESS } = require('@env');

const API_URL = `http://192.168.68.113:1400`;//`http://${IP_ADDRESS}:${PORT}`;//`http://192.168.68.113:1400`;
console.log(`API URL: ${API_URL}`);


// Function to handle login
export const checkLogin = async(email,password) => {
    const user = {
        email: email,
        password: password
    }
    console.log(user);

    try{
        const response = await axios.post(`${API_URL}/login`,user);
        if(response.status === 200){
            console.log(`login user: ${response.data.userId} , email: ${response.data.email}, name: ${response.data.name}`);
            const userId = response.data.userId;
            const email = response.data.email;
            const name = response.data.name;
            return {
                success: true,
                data: { userId, email, name },
                message: "Login successful"
            };
        }
        else{
            console.log('Error login user');
            const resMessage = response.data.message;
            return {
                success: false,
                data: null,
                message: `Error logging in user ${resMessage}`
            };
        }
    }catch(error){
        let message="";
        if (error.response) {
            // The request was made and the server responded with a status code outside the range of 2xx
            message = `Server responded with an error: ${error.response.data.message}`;
        } else if (error.request) {
            // The request was made but no response was received
            message = "No response received from server";
        } else {
            // Something happened in setting up the request that triggered an Error
            message = `Error setting up request: ${error.message}`;
        }
        console.log(message);
        return {
            success: false,
            data: null,
            message: message
        };
    }
}

// Function to handle registration
export const registerUser = async (name, email, password) => {
    const user = {
        name: name,
        email: email,
        password: password
    };

    try {
        const response = await axios.post(`${API_URL}/register`, user);
        return response.status; // Return the status code directly
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code outside the range of 2xx
            console.log("Server responded with an error: ", error.response.data);
            return error.response.status; // Return the exact error status code
        } else if (error.request) {
            // The request was made but no response was received
            console.log("No response received: ", error.request);
            return 2;
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error setting up request: ", error.message);
            return 3;
        }
    }
};

// Function to get all products
export async function fetchPokemons() {
    try {
        const getPokemons = await axios.get(`${API_URL}/Pokemon`);
        if(getPokemons.status===200){
            const pokemonList = getPokemons.data;
            console.log(`Pokemons list fetched: ${pokemonList}`);
            return pokemonList;
        }
        else{
            return null;
        }

    } catch (error) {
        console.log(`Error fetching Pokémons: ${JSON.stringify(error)}`);
        return null;
    }
}

export async function addPokemon(pokemon){
    try {
        console.debug(pokemon);
        const response = await axios.post(`${API_URL}/pokemon`, pokemon);
        console.log("pokemon added successfully");
        return response;
    } catch (error) {
        console.log('error uploading pokemon to sell: ' + error.message);
        throw error;
    }
}

// // Get all products in cart
export const getCart = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/cart/${userId}`);//TODO: handle where do I get te userId and what is the syntax
        console.log(response.data);
        return response.data;
    }catch(error) {
        console.error("Error fetching cart:", error.status);
        return error;
    }
};

// // Add product to cart
export const addToCart = async (userId, productId, quantity) => {
    console.log("Add to cart")
    try {
        const response = await axios.post(`${API_URL}/cart/add`, { userId, productId, quantity });

        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};


// Remove product from cart
export const removeFromCart = async (userId, productId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/cart/remove`, { userId, productId });
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};

// Validate that all items in cart are still available in stock. If not set new quantity to products in cart
export const checkCartAvailability= async (stockProducts,cartProducts)=>{
    try{
        for(let cartProduct of cartProducts){
            const stockProduct = stockProducts.find(product=> product._id.equals(cartProduct._id));

            if(!stockProduct){
                console.debug(`Product ${cartProduct.name} no longer in stock. Removing it from cart`);
                const retCode = removeFromCart(user.userId,cartProduct._id);
            }else if(stockProduct.quantity<cartProduct.quantity){
                console.debug(`Adjusting quantity for ${cartProduct.name} from ${cartProduct.quantity} to ${stockProduct.quantity}`);
                const retCode = addToCart(user.userId,cartProduct._id,(stockProduct.quantity-cartProduct.quantity));
            }
            console.log("Cart updated successfully");
        }
    }catch (error){
        console.log(`Error in checkCartAvailability: ${error}`);
    }
}
// Checkout
export const checkout = async (userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/checkout`, {userId: userId});
        return response.data;
    } catch (error) {
        console.error("Error during checkout:", error);
        throw error;
    }
};



