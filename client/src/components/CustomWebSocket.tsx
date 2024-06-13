import useWebSocket from "react-use-websocket";
import useGlobalStore from "../stores/GlobalStore";

export interface Command {
    action: string;
    params: any;
}

const useCustomWebSocket = () => {

    const { userId, roomId } = useGlobalStore();

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(import.meta.env.VITE_SOCKET_URL, {
        onOpen: () => {
            console.log("connection successful!");
            const connectionAction = { action: "connect", userId: userId, roomId: roomId };
            sendJsonMessage(connectionAction);
        },
        shouldReconnect: () => {
            return true
        }
    });

    return { sendJsonMessage, lastJsonMessage };
};

export default useCustomWebSocket;