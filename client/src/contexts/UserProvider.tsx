import React, { ReactNode, useReducer } from "react";
import UserContext from "./UserContext";
import { SESSION_STORAGE_ID_KEY } from "../env";
import HTTPManager from "../utils/HTTPManager";
import userReducer from "../reducers/UserReducer";

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

    const [state, dispatch] = useReducer(userReducer, { userId: initializeId(), roomId: "" });
    const api = new HTTPManager();

    return (
        <UserContext.Provider value={{ state, dispatch, api }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;