import { create } from "zustand";
import ClientWebSocket from "../utils/Socket";
import { SESSION_STORAGE_RID_KEY } from "../env";

export interface RoomState {
    ws: ClientWebSocket;
    roomId: string;
    setRoomId: (newRoomId: string) => void;
}

const useRoomStore = create<RoomState>()((set) => ({
    ws: new ClientWebSocket(),
    roomId: sessionStorage.getItem(SESSION_STORAGE_RID_KEY) || "",
    setRoomId: (newRoomId: string) => {
        sessionStorage.setItem(SESSION_STORAGE_RID_KEY, newRoomId);
        set(() => ({ roomId: newRoomId }));
    },
}));

export default useRoomStore;