import React, { ReactNode, useEffect, useReducer, useState } from "react";
import UserContext from "./UserContext";
import { SESSION_STORAGE_ID_KEY } from "../env";
import HTTPManager from "../utils/HTTPManager";
import reducer from "../reducers/UserReducer";

interface UserProviderProps {
    children: ReactNode;
}

const STORAGE_KEY = SESSION_STORAGE_ID_KEY;

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {

    const initializeId = () => {
        let userId: string = sessionStorage.getItem(STORAGE_KEY) || "";

        if (userId === "") {
            userId = crypto.randomUUID();
            sessionStorage.setItem(STORAGE_KEY, userId);
        }
        return userId;
    }

    const [state, dispatch] = useReducer(reducer, { userId: initializeId(), roomId: "", isHost: false });
    const api = new HTTPManager();

    useEffect(() => {

    }, []);

    return (
        <UserContext.Provider value={{ state, dispatch, api }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;