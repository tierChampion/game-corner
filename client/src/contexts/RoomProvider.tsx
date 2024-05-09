import React, { ReactNode } from "react";
import RoomContext from "./RoomContext";
import ClientWebSocket from "../utils/Socket";

interface RoomProviderProps {
    children: ReactNode;
}

const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {

    return (
        <RoomContext.Provider value={{ ws: new ClientWebSocket() }}>
            {children}
        </RoomContext.Provider>
    );
};

export default RoomProvider;