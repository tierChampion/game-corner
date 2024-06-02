import { ObjectId } from "mongodb";
import dbService from "./Database.service";

const ROOMS_FILE = "data/rooms.json";

export interface Room {
    _id: ObjectId;
    members: string[];
    playing: boolean;
}

class RoomService {
    get collection() {
        return dbService.getCollection<Room>(process.env.ROOM_COLLECTION!);
    }

    async getAllRooms() {
        return await this.collection?.find({}).toArray();
    }

    async getRoom(roomId: string) {
        return await this.collection?.findOne({ _id: new ObjectId(roomId) });
    }

    async createNewRoom() {
        const newRoom: Room = { _id: new ObjectId(), members: [], playing: false };
        await this.collection?.insertOne(newRoom);
        return newRoom;
    }

    async addPlayer(roomId: string, playerId: string) {
        const query = {
            _id: new ObjectId(roomId),
            $expr: { $lt: [{ $size: "$members" }, 2] },
        };
        const result = await this.collection?.updateOne(query, { $push: { members: playerId } });
        return result?.modifiedCount !== 0;
    }

    async removePlayer(roomId: string, playerId: string) {
        const result = await this.collection?.findOneAndUpdate({ _id: new ObjectId(roomId) },
            { $pull: { members: playerId } });
        let wasModified = false;
        let hasEmptyRoom = false;
        if (result) {
            wasModified = true;
            hasEmptyRoom = (result.members.length === 1 &&
                result.members[0] === playerId) &&
                !result.playing;
        }
        if (hasEmptyRoom) {
            setTimeout(() => this.cleanRooms(), 3000);
        }
        return wasModified;
    }

    async cleanRooms() {
        const filter = {
            $and: [
                { members: { $size: 0 } },
                { playing: false },
            ]
        }
        await this.collection?.deleteMany(filter);
    }

    async startGame(roomId: string) {
        await this.collection?.updateOne({ _id: new ObjectId(roomId) },
            { $set: { playing: true } });
    }

    async endGame(roomId: string) {
        await this.collection?.updateOne({ _id: new ObjectId(roomId) },
            { $set: { playing: false } });
    }
}

export default RoomService;