import axios from 'axios';
import { IP_ADDRESS,PORT } from '@env';
import Toast from "react-native-toast-message";
import {Alert} from "react-native";
// const { PORT, IP_ADDRESS } = require('@env');


// const API_URL = `http://192.168.68.113:1400`;//`http://${IP_ADDRESS}:${PORT}`;//`http://192.168.68.113:1400`;
const API_URL = `http://${IP_ADDRESS}:1400`;//`http://192.168.68.113:1400`;
console.log(`API URL: ${API_URL}`);


// Function to handle login
export const checkLogin = async(email,password) => {
    const user = {
        email: email,
        password: password
    }
    console.log(user);

    try{
        const response = await axios.post(`${API_URL}/user/login`,user);
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
        if(response.status === 201){
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
       
        // return response.status; // Return the status code directly

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

// Function to edit username
export const editUsername = async (userId,newUsername)=>{
    try{
        const response = await axios.post(`${API_URL}/user/edit`,{userId:userId, newName:newUsername});
        console.log(response.data);
        return response.data;
    }catch(error){
        console.error("Error edit username:", error.status);
        return error;
    }
}

// Function to get all products
export async function fetchPokemons() {
    try {
        const getPokemons = await axios.get(`${API_URL}/Pokemon`);
        if(getPokemons.status===200){
            const pokemonList = getPokemons.data;
            // console.log(`Pokemons list fetched: ${pokemonList}`);
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

// Add new Pokemon to products
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

// Function to edit an existing Pokemon
export async function editPokemon(pokemonId, updatedData) {
    try {
        const response = await axios.put(`${API_URL}/Pokemon/${pokemonId}`, updatedData);
        console.log("Pokemon updated successfully");
        return response;
    } catch (error) {
        console.log('Error updating Pokemon: ' + error.message);
        throw error;
    }
}

// Get all products in cart
export const getCart = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/cart/${userId}`);
        // console.log(response.data);
        return response.data;
    }catch(error) {
        console.error("Error fetching cart:", error.status);
        return error;
    }
};

// Add product to cart
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
export const removeFromCart = async (userId, productId,price) => {
    try {
        console.log(`Trying remove ${productId} from cart for user ${userId}`);
        const response = await axios.post(`${API_URL}/cart/remove`, { userId, productId,price });
        return response.data;
    } catch (error) {
        console.error("Error removing to cart:", error);
        throw error;
    }
};

// Validate that all items in cart are still available in stock. If not set new quantity to products in cart
export const checkCartAvailability = async (user, stockProducts, cartProducts) => {
    try {
        // console.debug("Checking availability for " + JSON.stringify(cartProducts));
        // console.debug(`stock products ${JSON.stringify(stockProducts)}`);
        for (let cartProduct of cartProducts) {
            // console.debug(`cart product = ${JSON.stringify(cartProduct)}`);

            // Ensure the stockProduct has the _id field correctly defined
            const stockProduct = stockProducts.find(product => {
                // console.log(`stock product = ${JSON.stringify(product)}`);
                return product._id === cartProduct.product._id; // Directly compare ids as strings
            });

            console.debug(`Got ${stockProduct}`);

            if (!stockProduct) {
                console.debug(`Product ${cartProduct.product.name} no longer in stock. Removing it from cart`);
                await removeFromCart(user.userId, cartProduct.product._id, cartProduct.quantity); // Ensure removeFromCart handles quantity
            } else if (stockProduct.quantity < cartProduct.quantity) {
                console.debug(`Adjusting quantity for ${cartProduct.product.name} from ${cartProduct.quantity} to ${stockProduct.quantity}`);
                await addToCart(user.userId, cartProduct.product._id, stockProduct.quantity - cartProduct.quantity);
            }
            console.log("Cart updated successfully");
        }
    } catch (error) {
        console.log(`Error in checkCartAvailability: ${error}`);
    }
};

// Checkout
export const checkout = async (userId,region,location, houseNum, cardOwner,cardNumber, expirationDate,cvv) => {
    console.log("Trying checkout cart");
    try {
        console.debug(`{${userId}, ${region},${location}, ${houseNum}, ${cardOwner},${cardNumber}, ${expirationDate}, ${cvv}}`);
        const response = await axios.post(`${API_URL}/checkout`, {
            userId: userId,
            region: region,
            location: location,
            houseNum: houseNum,
            cardOwner: cardOwner,
            cardNumber: cardNumber,
            expirationDate: expirationDate,
            cvv: cvv});
        console.debug(`response = ${response.data}`);
        return response.data;
    } catch (error) {
        console.error("Error during checkout:", error);
        throw error;
    }
};

// Get all orders for user
export const getOrders = async (userId) => {
    try {
        console.log('services order userid: ' + userId);
        const response = await axios.get(`${API_URL}/order/${userId}`);
        return response.data;
    }catch(error) {
        console.error("Error fetching orders:", error.status);
        return error;
    }
}

// Get all products that user sells
export const getUserProducts= async (userId)=>{
    try {
        const response = await axios.get(`${API_URL}/Pokemon/${userId}`);
        return response.data;
    }catch(error) {
        console.error("Error fetching user products:", error.status);
        return error;
    }
}

