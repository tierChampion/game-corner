import { createContext, useContext } from "react";
import HTTPManager from "../utils/HTTPManager";
import { Action } from "../reducers/UserReducer";

export interface UserData {
    state: any;
    dispatch: React.Dispatch<Action>;
    api: HTTPManager;
}

const UserContext = createContext<UserData | undefined>(undefined);

export const useUserContext = (): UserData => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
}

export default UserContext;
