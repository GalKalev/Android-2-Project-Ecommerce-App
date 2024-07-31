import React, {createContext, useState, useContext, useCallback} from 'react';
import {getCart} from "../api/apiServices";

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
}



export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({"userId":"66a78066d53f070dbf98ae3f","email":"haahaa@ha.com","name":"Haa"}); // {"userId":"66a3558d5774733480c06aa2","email":"Hadarasher@gmail.com","name":"Hadar"});
    const [cart, setCart] = useState({ products: [], totalPrice: 0 });


    return (
        <UserContext.Provider value={{ user, setUser, cart, setCart }}>
            {children}
        </UserContext.Provider>
    );
};