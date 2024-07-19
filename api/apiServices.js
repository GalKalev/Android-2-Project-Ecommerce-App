import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PORT} from './index'

const API_URL = `http://localhost:${PORT}`;

// Function to handle login

// Function to handle registration

// Function to get all products


// Function to get all products
export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

// Get all products in cart
export const getCart = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/cart/${userId}`);//TODO: handle where do I get te userId and what is the syntax
        return response.data;
    }catch(error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
};

// Add product to cart
export const addToCart = async (userId, productId, quantity) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/cart/add`, { userId, productId, quantity });
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


