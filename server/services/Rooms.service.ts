import FileSystemManager from "../utils/FileSystemManager.ts";

const ROOMS_FILE = "data/rooms.json";

class RoomService {
    private fsManager: FileSystemManager;

    constructor() {
        this.fsManager = new FileSystemManager();
    }

    async getAllRooms() {
        return JSON.parse(await this.fsManager.readFile(ROOMS_FILE));
    }

    async createNewRoom() {
        const rooms = await this.getAllRooms();
        const newRoom = {id: crypto.randomUUID()};
        rooms.push(newRoom);
        await this.fsManager.writeFile(ROOMS_FILE, JSON.stringify(rooms));
        return newRoom;
    }

    async deleteRoom(id: string) {
        let rooms = await this.getAllRooms();
        rooms = rooms.filter((roomId: string) => roomId !== id);
        await this.fsManager.writeFile(ROOMS_FILE, JSON.stringify(rooms));
    }
}

export default RoomService;