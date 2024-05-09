import { createContext, useContext } from "react";
import ClientWebSocket from "../utils/Socket";

export interface RoomData {
    ws: ClientWebSocket;
}

const RoomContext = createContext<RoomData | undefined>(undefined);

export const useRoomContext = (): RoomData => {
    const context = useContext(RoomContext);
    if (context === undefined) {
        throw new Error("useRoomContext must be used within a RoomProvider");
    }
    return context;
}

export default RoomContext;