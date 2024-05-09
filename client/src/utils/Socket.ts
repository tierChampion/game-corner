import { NavigateFunction } from "react-router-dom";
import { SERVER_SOCKET_URL } from "../env";

class ClientWebSocket {

    private ws: WebSocket;
    private opened: boolean;
    private userId: string;
    private roomId: string;

    constructor() {

        this.opened = false;
        this.userId = "";
        this.roomId = "";

        this.ws = new WebSocket(SERVER_SOCKET_URL);
    }

    initialise(userId: string, roomId: string, navigate: NavigateFunction) {
        this.userId = userId;
        this.roomId = roomId;

        this.ws = new WebSocket(SERVER_SOCKET_URL);
        this.ws.onopen = () => {
            this.opened = true;
            this.sendConnect();
        }
        this.ws.onmessage = (event) => {
            this.handleMessage(event, navigate);
        }
    }

    sendConnect() {
        const connectionCommand = { action: "connect", roomId: this.roomId, userId: this.userId };
        this.ws.send(JSON.stringify(connectionCommand));
    }

    sendStartGame() {
        const startCommand = { action: "startGame", roomId: this.roomId };
        this.ws.send(JSON.stringify(startCommand));
    }

    sendEndGame() {
        const endGame = { action: "endGame", roomId: this.roomId };
        this.ws.send(JSON.stringify(endGame));
    }

    handleMessage(event: MessageEvent<any>, navigate: NavigateFunction) {

        const command = JSON.parse(event.data);
        switch (command.action) {
            case "updateMembers":
                break;
            case "startGame":
                if (command.params.status === "success") {
                    navigate(`../game/${this.roomId}`);
                } else {
                    console.error("Error: unable to start the game.");
                }
                break;
            case "endGame":
                navigate(`../room/${this.roomId}`);
                break;
            default:
        }
    }

    close() {
        this.ws.close();
        this.opened = false;
    }
}

export default ClientWebSocket;
