import FileSystemManager from "../utils/FileSystemManager";

const ROOMS_FILE = "data/rooms.json";

export interface Room {
    id: string;
    members: string[];
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
        const newRoom = { id: crypto.randomUUID(), members: [] };
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
        rooms = rooms.filter((room: Room) => {
            if (room.id === roomId) {
                let length = room.members.length;
                room.members = room.members.filter((id: string) => id !== playerId);
                wasModified = room.members.length !== length;
            }
            // todo add a set timeout when the room is empty. 
            // if in 10 seconds, it is still empty, destroy the room
            // if (room.members.length !== 0) {
            return room;
            // }
        });
        await this.fsManager.writeFile(ROOMS_FILE, JSON.stringify(rooms));
        return wasModified;
    }

    async deleteRoom(id: string) {
        let rooms = await this.getAllRooms();
        rooms = rooms.filter((roomId: string) => roomId !== id);
        await this.fsManager.writeFile(ROOMS_FILE, JSON.stringify(rooms));
    }
}

export default RoomService;