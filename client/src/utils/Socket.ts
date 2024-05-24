import { NavigateFunction } from "react-router-dom";
import { SERVER_SOCKET_URL } from "../env";

class ClientWebSocket {

    private ws: WebSocket;
    private userId: string;
    private roomId: string;
    private lastCommand: any;
    private gameStartAction: (command: any) => void;
    private moveAction: (command: any) => void;

    constructor() {

        this.userId = "";
        this.roomId = "";
        this.lastCommand = { action: "", params: undefined };

        this.gameStartAction = () => {console.error("Error, this event was not setup.")};
        this.moveAction = () => {console.error("Error, this event was not setup.")};

        this.ws = new WebSocket(SERVER_SOCKET_URL);
    }

    initialise(userId: string, roomId: string, navigate: NavigateFunction) {
        this.userId = userId;
        this.roomId = roomId;

        this.ws = new WebSocket(SERVER_SOCKET_URL);
        this.ws.onopen = () => {
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
        const endGameCommand = { action: "endGame", roomId: this.roomId };
        this.ws.send(JSON.stringify(endGameCommand));
    }

    sendMove(selectedPiece: number, boardSquare: number) {
        const moveCommand = {
            action: "move",
            roomId: this.roomId,
            selectedPiece: selectedPiece,
            boardSquare: boardSquare
        };
        this.ws.send(JSON.stringify(moveCommand));
    }

    handleMessage(event: MessageEvent<any>, navigate: NavigateFunction) {

        const command = JSON.parse(event.data);
        switch (command.action) {
            case "startGame":
                if (command.params.status === "success") {
                    this.gameStartAction(command);
                    navigate(`../game/${this.roomId}`);
                } else {
                    console.error("Error: unable to start the game.");
                }
                break;
            case "endGame":
                navigate(`../room/${this.roomId}`);
                break;
            case "move":
                this.moveAction(command);
                break;
            default:
        }
        this.lastCommand = command;
    }

    close() {
        this.ws.close();
    }

    getLastCommand() {
        return this.lastCommand;
    }

    setGameStartAction(action: (command: any) => void) {
        this.gameStartAction = action;
    }

    setMoveAction(action: (command: any) => void) {
        this.moveAction = action;
    }
}

export default ClientWebSocket;
