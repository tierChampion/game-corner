import {createContext} from "react";

interface UserData {
    id: string;
}

const UserContext = createContext<UserData>({
    id: ''
});

export default UserContext;
