import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
}



export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({userId: 1,name:'K', email:'k@k.com'});
    const [cart, setCart] = useState({ products: [], totalPrice: 0 });

    return (
        <UserContext.Provider value={{ user, setUser, cart, setCart }}>
            {children}
        </UserContext.Provider>
    );
};