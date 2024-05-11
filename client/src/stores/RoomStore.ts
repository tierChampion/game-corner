import { create } from "zustand";
import ClientWebSocket from "../utils/Socket";

const useRoomStore = create((set) => {
    ws: new ClientWebSocket();
});

export default useRoomStore;