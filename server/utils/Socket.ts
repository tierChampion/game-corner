import WebSocket from "ws";
import RoomService from "../services/Rooms.service";
import GameService from "../services/Games.service";

interface UserInformation {
    userId: string;
    roomId: string;
}

class ServerWebSocket {
    private wss: WebSocket.Server;
    private roomService: RoomService;
    private gameService: GameService;
    private userInfoMap: Map<WebSocket, UserInformation>;
    private userMap: Map<string, WebSocket>;

    constructor(port: number) {
        this.wss = new WebSocket.Server({ port: port });
        this.roomService = new RoomService();
        this.gameService = new GameService();
        this.userInfoMap = new Map();
        this.userMap = new Map();

        this.wss.on("connection", (ws, req) => {
            ws.on("message", (message) => {
                this.handleCommand(ws, message);
            });

            ws.on("close", () => {
                this.close(ws);
            });
        });
    }

    handleCommand(ws: WebSocket, message: WebSocket.RawData) {
        const command = JSON.parse(message.toString());
        console.log("New command: ", command);
        switch (command.action) {
            case "connect":
                this.connect(ws, command.roomId, command.userId);
                break;
            case "start":
                this.start(command.roomId);
                break;
            case "end":
                this.end(command.roomId);
                break;
            case "move":
                this.move(command.gameId, command.pick, command.place);
                break;
            default:
        }
    }

    async getRoomWS(roomId: string, userId: string) {
        const room = (await this.roomService.getRoom(roomId))?.members || [];
        const sockets: WebSocket[] = [];
        room.forEach((id: string) => {
            if (id !== userId) {
                sockets.push(this.userMap.get(id)!);
            }
        });
        return sockets;
    }

    async connect(ws: WebSocket, roomId: string, userId: string) {
        let successful = true;
        if (this.userMap.get(userId) === undefined) {
            successful = await this.roomService.addPlayer(roomId, userId);
            if (successful) {
                const userInformation = { userId: userId, roomId: roomId };
                this.userInfoMap.set(ws, userInformation);
                this.userMap.set(userId, ws);
            }
        } else {
            const old = this.userMap.get(userId)!;
            const userInfo = this.userInfoMap.get(old)!;
            this.userInfoMap.set(ws, userInfo);
            this.userInfoMap.delete(old);
            this.userMap.set(userId, ws);
        }
        if (successful) {
            await this.broadcastToRoom(roomId, "", "members");
        }
    }

    async start(roomId: string) {
        const room = await this.roomService.getRoom(roomId);
        if (room) {
            await this.gameService.createNewGame(roomId);
            await this.roomService.startGame(roomId);
            await this.broadcastToRoom(roomId, "", "start",
                {
                    isValid: true,
                    start: room.members[Math.floor(Math.random() * room.members.length)]
                });
        }
    }

    async end(roomId: string) {
        await this.gameService.deleteGame(roomId);
        await this.roomService.endGame(roomId);
        await this.broadcastToRoom(roomId, "", "end");
    }

    async move(gameId: string, pick: number, place: number) {
        await this.gameService.placeAndPick(gameId, place, pick);
        await this.broadcastToRoom(gameId, "", "move",
            { pick: pick, place: place });
    }

    async close(ws: WebSocket) {
        const userInfo = this.userInfoMap.get(ws);
        if (userInfo !== undefined) {
            this.userInfoMap.delete(ws);
            this.userMap.delete(userInfo.userId);
            await this.roomService.removePlayer(userInfo.roomId, userInfo.userId);
            await this.broadcastToRoom(userInfo.roomId, "", "members");
        }
    }

    async broadcastToRoom(roomId: string, userId: string, action: string, params?: any) {
        const room = await this.getRoomWS(roomId, userId);
        let command = { action: action, params: undefined };
        if (params) {
            command.params = params;
        }
        room.forEach((ws: WebSocket) => {
            if (ws) {
                ws.send(JSON.stringify(command));
            }
        });
    }
}

export default ServerWebSocket;
