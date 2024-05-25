import { SERVER_SOCKET_URL } from "../env";
import useWebSocket from "react-use-websocket";
import useGlobalStore from "../stores/GlobalStore";

export interface Command {
    action: string;
    params: any;
}

const useCustomWebSocket = () => {

    const userId = useGlobalStore((state) => state.userId);
    const roomId = useGlobalStore((state) => state.roomId);

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(SERVER_SOCKET_URL, {
        onOpen: () => {
            console.log("connection successful!");
            const connectionAction = { action: "connect", userId: userId, roomId: roomId };
            sendJsonMessage(connectionAction);
        },
        shouldReconnect: (closeEvent) => {
            return true
        }
    });

    return { sendJsonMessage, lastJsonMessage };
};

export default useCustomWebSocket;