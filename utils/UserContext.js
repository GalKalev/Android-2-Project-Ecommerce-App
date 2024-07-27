import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
}



export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({"userId":"667ae8ba2cc3de3b7f81f7c7","email":"K@k.com","name":"K"});
    const [cart, setCart] = useState({ products: [], totalPrice: 0 });

    return (
        <UserContext.Provider value={{ user, setUser, cart, setCart }}>
            {children}
        </UserContext.Provider>
    );
};