import React, {createContext, useState, useContext, useCallback, useMemo} from 'react';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
}



export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({"userId":"66a79a0f187aa2978db9e1a9","email":"g@g.com","name":"G"}); // {"userId":"66a3558d5774733480c06aa2","email":"Hadarasher@gmail.com","name":"Hadar"});
    // const [user, setUser] = useState({"userId":"66a9edc8944874e058e321a8","email":"p@p.com","name":"P"}); // {"userId":"66a3558d5774733480c06aa2","email":"Hadarasher@gmail.com","name":"Hadar"});

    const [cart, setCart] = useState({ products: [], totalPrice: 0 });


    return (
        <UserContext.Provider value={{ user, setUser, cart, setCart }}>
            {children}
        </UserContext.Provider>
    );
};