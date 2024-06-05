import { ObjectId } from "mongodb";
import dbService from "./Database.service";

const PIECE_COUNT = 16;

export interface Game {
    _id: ObjectId;
    board: number[];
    bank: number[];
    pick: number;
}

class GameService {
    get collection() {
        return dbService.getCollection<Game>(process.env.GAME_COLLECTION!);
    }

    async getAllGames() {
        return await this.collection?.find({}).toArray();
    }

    async getGame(gameId: string) {
        return await this.collection?.findOne({ _id: new ObjectId(gameId) });
    }

    async createNewGame(roomId: string) {
        const newGame = {
            _id: new ObjectId(roomId),
            board: Array(PIECE_COUNT).fill(-1),
            bank: [...Array(PIECE_COUNT)].map((_, index) => index),
            pick: -1
        };
        await this.collection?.insertOne(newGame);
        return newGame;
    }

    async placeAndPick(gameId: string, place: number, newPick: number) {
        const filter = {
            _id: new ObjectId(gameId)
        };
        const update = [{
            $set: {
                board: {
                    $cond: {
                        if: { $ne: [place, -1] },
                        then: {
                            $concatArrays: [
                                (place !== 0 ? { $slice: ["$board", 0, place] } : []),
                                ["$pick"],
                                { $slice: ["$board", place + 1, { $size: "$board" }] }
                            ]
                        },
                        else: "$board"
                    },
                },
                bank: {
                    $concatArrays: [
                        (newPick !== 0 ? { $slice: ["$bank", 0, newPick] } : []),
                        [-1],
                        { $slice: ["$bank", newPick + 1, { $size: "$bank" }] }
                    ]
                },
                pick: newPick,
            }
        }];
        await this.collection?.updateOne(filter, update);
    }

    async deleteGame(gameId: string) {
        await this.collection?.deleteOne({ _id: new ObjectId(gameId) });
    }
}

export default GameService;
