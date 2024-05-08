import { NavigateFunction, useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import HTTPManager from "./HTTPManager";

class ClientWebSocket {

    private ws: WebSocket;
    private userId: string;
    private roomId: string;

    constructor(url: string, userId: string, roomId: string, navigate: NavigateFunction) {

        this.userId = userId;
        this.roomId = roomId;

        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            this.connect();
        }
        this.ws.onmessage = (event) => {
            this.handleMessage(event, navigate);
        }
    }

    connect() {
        const connectionCommand = { action: "connect", roomId: this.roomId, userId: this.userId };
        this.ws.send(JSON.stringify(connectionCommand));
    }

    startGame() {
        const startCommand = { action: "startGame", roomId: this.roomId, userId: this.userId };
        this.ws.send(JSON.stringify(startCommand));
    }

    handleMessage(event: MessageEvent<any>, navigate: NavigateFunction) {

        const command = JSON.parse(event.data);
        if (event.data === "ping") {
            this.ws.send("pong");
        }
        else if (command.action === "updateMembers") {
            // getMembers, needs api
            // do nothing for now
        }
        else if (command.action === "startGame") {
            navigate("../game");
        }
    }

    close() {
        this.ws.close();
    }
}

export default ClientWebSocket;
