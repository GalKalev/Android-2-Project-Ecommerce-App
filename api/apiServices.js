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
            return {
                success: false,
                data: null,
                message: "Error logging in user"
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
        //! Fetch product from database
        //! Fetch products from user's cart ??

        //! Demo pokemons before fetching from database
        // const demoPokemons = [
        //     {
        //         id: 0,
        //         user: 'gal',
        //         name: 'pikachu',
        //         url: 'https://pokeapi.co/api/v2/pokemon/pikachu/',
        //         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        //         gender: 0,
        //         level: 50,
        //         isShiny: false,
        //         abilities: ['static'],
        //         moves: ['mega-punch', 'thunder-punch', 'slam'],
        //         species: ['pikachu'],
        //         stats: {
        //             hp: 50,
        //             attack: 30,
        //             defense: 40,
        //             specialAttack: 60,
        //             specialDefense: 70,
        //             speed: 20
        //         },
        //         types: ['electric'],
        //         price: 8000,
        //         quantity: 2
        //     },
        //     {
        //         id: 1,
        //         user: 'raz',
        //         name: 'venusaur',
        //         url: 'https://pokeapi.co/api/v2/pokemon/venusaur/',
        //         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/3.png',
        //         gender: 1,
        //         level: 4,
        //         isShiny: true,
        //         abilities: ['overgrow', 'chlorophyll'],
        //         moves: ['swords-dance', 'bind'],
        //         species: ['venusaur'],
        //         stats: {
        //             hp: 20,
        //             attack: 30,
        //             defense: 40,
        //             specialAttack: 15,
        //             specialDefense: 23,
        //             speed: 17
        //         },
        //         types: ['grass', 'poison'],
        //         price: 1000,
        //         quantity: 4
        //     },
        //     {
        //         id: 2,
        //         user: 'ash',
        //         name: 'charizard',
        //         url: 'https://pokeapi.co/api/v2/pokemon/charizard/',
        //         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
        //         gender: 0,
        //         level: 36,
        //         isShiny: false,
        //         abilities: ['blaze', 'solar-power'],
        //         moves: ['flamethrower', 'fly', 'dragon-claw'],
        //         species: ['charizard'],
        //         stats: {
        //             hp: 78,
        //             attack: 84,
        //             defense: 78,
        //             specialAttack: 109,
        //             specialDefense: 85,
        //             speed: 100
        //         },
        //         types: ['fire', 'flying'],
        //         price: 15000,
        //         quantity: 1
        //     },
        //     {
        //         id: 3,
        //         user: 'misty',
        //         name: 'gyarados',
        //         url: 'https://pokeapi.co/api/v2/pokemon/gyarados/',
        //         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png',
        //         gender: 1,
        //         level: 45,
        //         isShiny: true,
        //         abilities: ['intimidate', 'moxie'],
        //         moves: ['hydro-pump', 'hyper-beam', 'dragon-dance'],
        //         species: ['gyarados'],
        //         stats: {
        //             hp: 95,
        //             attack: 125,
        //             defense: 79,
        //             specialAttack: 60,
        //             specialDefense: 100,
        //             speed: 81
        //         },
        //         types: ['water', 'flying'],
        //         price: 20000,
        //         quantity: 1
        //     },
        //     {
        //         id: 4,
        //         user: 'brock',
        //         name: 'onix',
        //         url: 'https://pokeapi.co/api/v2/pokemon/onix/',
        //         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png',
        //         gender: 0,
        //         level: 20,
        //         isShiny: false,
        //         abilities: ['rock-head', 'sturdy'],
        //         moves: ['rock-throw', 'earthquake', 'iron-tail'],
        //         species: ['onix'],
        //         stats: {
        //             hp: 35,
        //             attack: 45,
        //             defense: 160,
        //             specialAttack: 30,
        //             specialDefense: 45,
        //             speed: 70
        //         },
        //         types: ['rock', 'ground'],
        //         price: 3000,
        //         quantity: 5
        //     },
        //     {
        //         id: 5,
        //         user: 'gary',
        //         name: 'umbreon',
        //         url: 'https://pokeapi.co/api/v2/pokemon/umbreon/',
        //         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/197.png',
        //         gender: 1,
        //         level: 30,
        //         isShiny: false,
        //         abilities: ['synchronize'],
        //         moves: ['dark-pulse', 'faint-attack', 'moonlight'],
        //         species: ['umbreon'],
        //         stats: {
        //             hp: 95,
        //             attack: 65,
        //             defense: 110,
        //             specialAttack: 60,
        //             specialDefense: 130,
        //             speed: 65
        //         },
        //         types: ['dark'],
        //         price: 12000,
        //         quantity: 3
        //     },
        //     {
        //         id: 6,
        //         user: 'ash',
        //         name: 'pikachu',
        //         url: 'https://pokeapi.co/api/v2/pokemon/pikachu/',
        //         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        //         gender: 1,
        //         level: 5,
        //         isShiny: false,
        //         abilities: ['static'],
        //         moves: ['quick-attack', 'thunderbolt', 'iron-tail'],
        //         species: ['pikachu'],
        //         stats: {
        //             hp: 35,
        //             attack: 55,
        //             defense: 40,
        //             specialAttack: 50,
        //             specialDefense: 50,
        //             speed: 90
        //         },
        //         types: ['electric'],
        //         price: 1000,
        //         quantity: 3
        //     }
        // ];
        const getPokemons = await axios.get(`${API_URL}/Pokemon`);
        if(getPokemons.status===200){
            const pokemonList = getPokemons.data;
            // console.log(`Pokemons list fetched: ${pokemonList}`);
            return pokemonList;
        }
        else{
            return null
        }

    } catch (error) {
        console.log(`Error fetching Pokémons: ${JSON.stringify(error)}`);
        return null;
    }
}

export async function addPokemon(pokemon){
    try {
        // console.debug(pokemon);
        const response = await axios.post(`${API_URL}/pokemon`, pokemon);
        console.log("pokemon added successfully");
        return response;
    } catch (error) {
        console.log('error uploading pokemon to sell: ' + error.message);
        throw error;
    }
}

// Function to get all products
// export const getProducts = async () => {
//     try {
//         const response = await axios.get(`${API_URL}/products`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         throw error;
//     }
// };

// // Function to get all products
// export const getProducts = async () => {
//     try {
//         const response = await axios.get(`${API_URL}/products`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         throw error;
//     }
// };

// // Get all products in cart
// export const getCart = async (userId) => {
//     try {
//         const response = await axios.get(`${API_URL}/cart/${userId}`);//TODO: handle where do I get te userId and what is the syntax
//         return response.data;
//     }catch(error) {
//         console.error("Error fetching cart:", error);
//         throw error;
//     }
// };

// // Add product to cart
// export const addToCart = async (userId, productId, quantity) => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/cart/add`, { userId, productId, quantity });
//         return response.data;
//     } catch (error) {
//         console.error("Error adding to cart:", error);
//         throw error;
//     }
// };

// // Remove product from cart
// export const removeFromCart = async (userId, productId) => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/cart/remove`, { userId, productId });
//         return response.data;
//     } catch (error) {
//         console.error("Error adding to cart:", error);
//         throw error;
//     }
// };

// // Checkout
// export const checkout = async (userId) => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/checkout`, {userId: userId});
//         return response.data;
//     } catch (error) {
//         console.error("Error during checkout:", error);
//         throw error;
//     }
// };


