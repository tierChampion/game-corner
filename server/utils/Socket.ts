import WebSocket from "ws";
import RoomService from "../services/Rooms.service";

interface UserInformation {
    userId: string;
    roomId: string;
}

class ServerWebSocket {

    private wss: WebSocket.Server;
    private roomService: RoomService;
    private userInfoMap: Map<WebSocket, UserInformation>;
    private userMap: Map<string, WebSocket>;

    constructor(port: number) {
        this.wss = new WebSocket.Server({ port: port });
        this.roomService = new RoomService();
        this.userInfoMap = new Map();
        this.userMap = new Map();

        this.wss.on("connection", (ws, req) => {

            ws.on("message", (message) => {
                this.handleCommand(ws, message);
            });

            ws.on("close", () => {
                console.log("closed!");
                this.close(ws);
            });
        });
    }

    handleCommand(ws: WebSocket, message: WebSocket.RawData) {
        const command = JSON.parse(message.toString());
        console.log("New command: ", command);
        switch (command.action) {
            case "connect":
                this.connection(ws, command.roomId, command.userId);
                break;
            case "startGame":
                this.startGame(command.roomId);
                break;
            case "endGame":
                this.endGame(command.roomId);
                break;
            case "move":
                this.moveGame(command.roomId, command.selectedPiece, command.boardSquare);
                break;
            default:
        }
    }

    async getRoomWS(roomId: string) {
        const room = (await this.roomService.getRoom(roomId))?.members || [];
        return room.map((userId: string) => {
            return this.userMap.get(userId);
        });
    }

    async connection(ws: WebSocket, roomId: string, userId: string) {
        if (this.userMap.get(userId) === undefined) {
            await this.roomService.addPlayer(roomId, userId);
            const userInformation = { userId: userId, roomId: roomId };
            this.userInfoMap.set(ws, userInformation);
            this.userMap.set(userId, ws);
        } else {
            const old = this.userMap.get(userId)!;
            const userInfo = this.userInfoMap.get(old)!;
            this.userInfoMap.set(ws, userInfo);
            this.userInfoMap.delete(old);
            this.userMap.set(userId, ws);
        }
    }

    async startGame(roomId: string) {
        const room = await this.roomService.getRoom(roomId);
        const status = room.members?.length === 2;
        // needs to be 2 in the room
        this.broadcastToRoom(roomId, "startGame",
            {
                status: status ? "success" : "failed",
                start: room.members[Math.floor(Math.random() * room.members.length)]
            });
    }

    endGame(roomId: string) {
        this.broadcastToRoom(roomId, "endGame");
    }

    moveGame(roomId: string, selectedPiece: number, boardSquare: number) {
        this.broadcastToRoom(roomId, "move",
            { selectedPiece: selectedPiece, boardSquare: boardSquare });
    }

    async close(ws: WebSocket) {
        const userInfo = this.userInfoMap.get(ws);
        if (userInfo !== undefined) {
            console.log("okkk");
            this.userInfoMap.delete(ws);
            this.userMap.delete(userInfo.userId);
            await this.roomService.removePlayer(userInfo.roomId, userInfo.userId);
        }
    }

    async broadcastToRoom(roomId: string, action: string, params?: any) {
        const room = await this.getRoomWS(roomId);
        let command = { action: action, params: undefined };
        if (params) {
            command.params = params;
        }
        room.forEach((ws: WebSocket) => {
            ws.send(JSON.stringify(command));
        });
    }
}

export default ServerWebSocket;
