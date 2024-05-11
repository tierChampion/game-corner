import { create } from "zustand";
import { SESSION_STORAGE_ID_KEY } from "../env";

const initializeId = () => {
        let userId: string = sessionStorage.getItem(SESSION_STORAGE_ID_KEY) || "";

        if (userId === "") {
            userId = crypto.randomUUID();
            sessionStorage.setItem(SESSION_STORAGE_ID_KEY, userId);
        }
        return userId;
    }

const useGlobalStore = create((set) => {
    userId: initializeId();
    roomId: "";
    setRoomId: (newRoomId: string) => set(() => ({roomId: newRoomId}));
});

export default useGlobalStore;
