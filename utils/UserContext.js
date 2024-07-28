import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
}



export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({"userId":"66799a620e1a8670b4d1b617","email":"g@f.com","name":"G"});
    const [cart, setCart] = useState({ products: [], totalPrice: 0 });

    return (
        <UserContext.Provider value={{ user, setUser, cart, setCart }}>
            {children}
        </UserContext.Provider>
    );
};