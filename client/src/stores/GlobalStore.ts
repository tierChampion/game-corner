import { create } from "zustand";
import { SESSION_STORAGE_UID_KEY, SESSION_STORAGE_RID_KEY } from "../env";
import HTTPManager from "../utils/HTTPManager";

export interface GlobalState {
    userId: string;
    roomId: string;
    setRoomId: (newRoomId: string) => void;
    api: HTTPManager;
}

const initializeId = () => {
    let userId: string = sessionStorage.getItem(SESSION_STORAGE_UID_KEY) || "";

    if (userId === "") {
        userId = crypto.randomUUID();
        sessionStorage.setItem(SESSION_STORAGE_UID_KEY, userId);
    }
    return userId;
}

const useGlobalStore = create<GlobalState>()((set) => ({
    userId: initializeId(),
    roomId: sessionStorage.getItem(SESSION_STORAGE_RID_KEY) || "",
    setRoomId: (newRoomId: string) => {
        sessionStorage.setItem(SESSION_STORAGE_RID_KEY, newRoomId);
        set(() => ({ roomId: newRoomId }));
    },
    api: new HTTPManager(),
}));

export default useGlobalStore;
