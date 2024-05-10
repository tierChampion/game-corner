import { createContext, useContext } from "react";
import ClientWebSocket from "../utils/Socket";
import { RoomAction } from "../reducers/RoomReducer";

export interface RoomData {
    ws: ClientWebSocket;
    state: any;
    dispatch: React.Dispatch<RoomAction>;
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