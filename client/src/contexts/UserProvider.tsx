import React, { ReactNode, useEffect, useState } from "react";
import UserContext from "./UserContext";

interface UserProviderProps {
    children: ReactNode;
}

const SESSION_STORAGE_ID_KEY = "uid";

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [id, setId] = useState<string>('');

    const generateRandomUserID = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, "0");
    }

    useEffect(() => {
        let userId: string = sessionStorage.getItem(SESSION_STORAGE_ID_KEY) || "";

        if (userId === "") {
            userId = generateRandomUserID();
            sessionStorage.setItem(SESSION_STORAGE_ID_KEY, userId);
        }

        setId(userId);
    }, []);

    return (
        <UserContext.Provider value={{ id }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;