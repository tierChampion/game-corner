import { create } from "zustand";
import { SESSION_STORAGE_UID_KEY } from "../env";
import HTTPManager from "../utils/HTTPManager";

export interface GlobalState {
    userId: string;
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
    api: new HTTPManager(),
}));

export default useGlobalStore;
