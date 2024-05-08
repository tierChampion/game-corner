import WebSocket from "ws";
import RoomService from "../services/Rooms.service";

class ServerWebSocket {

    private wss: WebSocket.Server;
    private roomService: RoomService;
    private heartbeatMap: Map<WebSocket, boolean>;
    private userMap: Map<WebSocket, string>;
    private roomMap: Map<string, WebSocket[]>;

    constructor(port: number) {
        this.wss = new WebSocket.Server({ port: port });
        this.roomService = new RoomService();
        this.heartbeatMap = new Map();
        this.userMap = new Map();
        this.roomMap = new Map();

        this.wss.on("connection", (ws, req) => {
            // handle the connection criteria (if it is valid)
            this.heartbeatMap.set(ws, true);

            ws.on("message", (message) => {
                // handle incoming information
                this.handleCommand(ws, message);
            });

            ws.on("pong", () => {
                this.heartbeatMap.set(ws, true);
            });

            ws.on("close", () => {
                // this.broadcastUpdate(..., "updateRoom");
            });
        });

        const heartBeatRoutine = setInterval(() => {
            this.wss.clients.forEach((ws) => {
                if (!this.heartbeatMap.get(ws)) {
                    // remove player from room
                    console.log("removed from room!");
                    return ws.terminate();
                }
                this.heartbeatMap.set(ws, false);
                ws.ping();
            });
        }, 10000);
    }

    handleCommand(ws: WebSocket, message: WebSocket.RawData) {
        const command = JSON.parse(message.toString());
        console.log("New command: ", command);
        switch (command.action) {
            case "connect":
                this.roomService.addPlayer(command.roomId, command.userId);
                this.userMap.set(ws, command.userId);
                const wsInRoom = this.roomMap.get(command.roomId) || [];
                wsInRoom.push(ws);
                this.roomMap.set(command.roomId,
                    wsInRoom);
                // specify the room todo
                this.broadcastToRoom(command.roomId, "updateMembers");
                break;
            case "startGame":
                this.broadcastToRoom(command.roomId, "startGame");
                break;
            default:
        }
    }

    broadcastToRoom(roomId: string, message: string) {
        const room = this.roomMap.get(roomId) || [];
        room.forEach((ws) => {
            ws.send(message);
        });
    }
}

export default ServerWebSocket;
