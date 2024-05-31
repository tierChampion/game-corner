import FileSystemManager from "../utils/FileSystemManager";

const ROOMS_FILE = "data/rooms.json";

export interface Room {
    id: string;
    members: string[];
    playing: boolean;
}

class RoomService {
    private fsManager: FileSystemManager;

    constructor() {
        this.fsManager = new FileSystemManager();
    }

    async getAllRooms() {
        try {
            return JSON.parse(await this.fsManager.readFile(ROOMS_FILE));
        } catch (error) {
            console.error("Error parsing the rooms:", error);
            return [];
        }
    }

    async getRoom(roomId: string) {
        return (await this.getAllRooms()).filter((room: Room) => room.id === roomId)[0];
    }

    async createNewRoom() {
        const rooms = await this.getAllRooms();
        const newRoom: Room = { id: crypto.randomUUID(), members: [], playing: false };
        rooms.push(newRoom);
        await this.fsManager.writeFile(ROOMS_FILE, JSON.stringify(rooms));
        return newRoom;
    }

    async addPlayer(roomId: string, playerId: string) {
        let wasModified = false;
        let rooms = await this.getAllRooms();
        rooms = rooms.map((room: Room) => {
            if (room.id === roomId && !room.members.includes(playerId)) {
                room.members.push(playerId);
                wasModified = true;
            }
            return room;
        });
        await this.fsManager.writeFile(ROOMS_FILE, JSON.stringify(rooms));
        return wasModified;
    }

    async removePlayer(roomId: string, playerId: string) {
        let wasModified = false;
        let rooms = await this.getAllRooms();
        let hasEmptyRoom = false;
        rooms = rooms.filter((room: Room) => {
            if (room.id === roomId) {
                let length = room.members.length;
                room.members = room.members.filter((id: string) => id !== playerId);
                wasModified = room.members.length !== length;
            }
            if (room.members.length === 0 && !room.playing) {
                hasEmptyRoom = true;
            }
            return room;
        });
        await this.fsManager.writeFile(ROOMS_FILE, JSON.stringify(rooms));
        if (hasEmptyRoom) {
            this.cleanRooms();
        }
        return wasModified;
    }

    async cleanRooms() {
        let rooms = await this.getAllRooms();
        rooms = rooms.filter((room: Room) => room.members.length !== 0 || room.playing);
        await this.fsManager.writeFile(ROOMS_FILE, JSON.stringify(rooms));
    }

    async startGame(roomId: string) {
        let rooms = await this.getAllRooms();
        rooms = rooms.map((room: Room) => {
            if (room.id === roomId) {
                room.playing = true;
            }
            return room;
        });

        await this.fsManager.writeFile(ROOMS_FILE, JSON.stringify(rooms));
    }

    async endGame(roomId: string) {
        let rooms = await this.getAllRooms();
        rooms = rooms.map((room: Room) => {
            if (room.id === roomId) {
                room.playing = false;
            }
            return room;
        });

        await this.fsManager.writeFile(ROOMS_FILE, JSON.stringify(rooms));
    }
}

export default RoomService;