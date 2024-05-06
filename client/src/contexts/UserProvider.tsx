import React, { ReactNode, useEffect, useState } from "react";
import UserContext from "./UserContext";

interface UserProviderProps {
    children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [id, setId] = useState<string>('');

    const generateRandomUserID = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12);
    }

    useEffect(() => {
        let userId = sessionStorage.getItem("uid") || "";

        if (userId === "") {
            console.log("localset");
            userId = generateRandomUserID();
            sessionStorage.setItem("uid", userId);
        }
        console.log("ok");

        setId(userId);
    }, []);

    return (
        <UserContext.Provider value={{ id }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;