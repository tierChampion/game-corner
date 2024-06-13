import { create } from "zustand";
import HTTPManager from "../utils/HTTPManager";

export interface GlobalState {
    userId: string;
    roomId: string;
    setRoomId: (newRoomId: string) => void;
    api: HTTPManager;
}

const UID_STORAGE_KEY = "uid";
const RID_STORAGE_KEY = "rid";

const initializeId = () => {
    let userId: string = sessionStorage.getItem(UID_STORAGE_KEY) || "";

    if (userId === "") {
        userId = crypto.randomUUID();
        sessionStorage.setItem(UID_STORAGE_KEY, userId);
    }
    return userId;
}

const useGlobalStore = create<GlobalState>()((set) => ({
    userId: initializeId(),
    roomId: sessionStorage.getItem(RID_STORAGE_KEY) || "",
    setRoomId: (newRoomId: string) => {
        sessionStorage.setItem(RID_STORAGE_KEY, newRoomId);
        set(() => ({ roomId: newRoomId }));
    },
    api: new HTTPManager(),
}));

export default useGlobalStore;
