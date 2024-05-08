import WebSocket from "ws";
import RoomService from "../services/Rooms.service";

interface UserInformation {
    userId: string;
    roomId: string;
}

class ServerWebSocket {

    private wss: WebSocket.Server;
    private roomService: RoomService;
    private heartbeatMap: Map<WebSocket, boolean>;
    private userInfoMap: Map<WebSocket, UserInformation>;
    private roomMap: Map<string, WebSocket[]>;

    constructor(port: number) {
        this.wss = new WebSocket.Server({ port: port });
        this.roomService = new RoomService();
        this.heartbeatMap = new Map();
        this.userInfoMap = new Map();
        this.roomMap = new Map();

        this.wss.on("connection", (ws, req) => {
            this.heartbeatMap.set(ws, true);

            ws.on("message", (message) => {
                // handle incoming information
                this.handleCommand(ws, message);
            });

            ws.on("pong", () => {
                this.heartbeatMap.set(ws, true);
            });

            ws.on("close", () => {
                console.log("closed!");
                this.close(ws);
            });
        });

        const heartBeatRoutine = setInterval(() => {
            this.wss.clients.forEach((ws) => {
                if (!this.heartbeatMap.get(ws)) {
                    console.log("user quit!");
                    return ws.close();
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
                this.connection(ws, command.roomId, command.userId);
                break;
            case "startGame":
                this.broadcastToRoom(command.roomId, "startGame");
                break;
            default:
        }
    }

    async connection(ws: WebSocket, roomId: string, userId: string) {
        await this.roomService.addPlayer(roomId, userId);
        const userInformation = { userId: userId, roomId: roomId };
        this.userInfoMap.set(ws, userInformation);
        const wsInRoom = this.roomMap.get(roomId) || [];
        wsInRoom.push(ws);
        this.roomMap.set(roomId,
            wsInRoom);
        // specify the room todo
        this.broadcastToRoom(roomId, "updateMembers");
    }

    async close(ws: WebSocket) {
        this.heartbeatMap.delete(ws);
        const userInfo = this.userInfoMap.get(ws);
        if (userInfo !== undefined) {
            const newRoom = this.roomMap.get(userInfo.roomId)?.filter((userWs) => userWs !== ws);
            if (newRoom !== undefined) {
                this.roomMap.set(userInfo.roomId,
                    newRoom);
            }
            await this.roomService.removePlayer(userInfo.roomId, userInfo.userId);
            this.broadcastToRoom(userInfo.roomId, "updateRoom");
            this.userInfoMap.delete(ws);
        }
    }

    broadcastToRoom(roomId: string, action: string, params?: any) {
        const room = this.roomMap.get(roomId) || [];
        room.forEach((ws) => {
            const command = {action: action};
            ws.send(JSON.stringify(command));
        });
    }
}

export default ServerWebSocket;
