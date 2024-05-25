import FileSystemManager from "../utils/FileSystemManager";

const GAMES_FILE = "data/games.json";

export interface Game {
    id: string;
    board: number[];
    bank: number[];
    pick: number;
}

class GameService {
    private fsManager: FileSystemManager;

    constructor() {
        this.fsManager = new FileSystemManager();
    }

    async getAllGames(): Promise<Game[]> {
        try {
            return JSON.parse(await this.fsManager.readFile(GAMES_FILE));
        } catch (error) {
            console.error("Error parsing the games: ", error);
            return [];
        }
    }

    async getGame(gameId: string) {
        return (await this.getAllGames()).filter((game: Game) => game.id === gameId)[0];
    }

    async createNewGame(roomId: string) {
        const games = await this.getAllGames();
        const newGame = {
            id: roomId,
            board: Array(4 * 4).fill(-1),
            bank: [...Array(4 * 4)].map((_, index) => index),
            pick: -1
        };
        games.push(newGame);
        await this.fsManager.writeFile(GAMES_FILE, JSON.stringify(games));
        return newGame;
    }

    async pickPiece(gameId: string, pick: number) {
        let games = await this.getAllGames();
        games = games.map((game) => {
            if (game.id === gameId) {
                game.pick = pick;
                game.bank[pick] = -1;
            }
            return game;
        });
        await this.fsManager.writeFile(GAMES_FILE, JSON.stringify(games));
    }

    async placeAndPick(gameId: string, place: number, pick: number) {
        let games = await this.getAllGames();
        games = games.map((game) => {
            if (game.id === gameId && pick !== -1) {
                if (place !== -1) {
                    game.board[place] = game.pick;
                }
                game.pick = pick;
                game.bank[pick] = -1;
            }
            return game;
        });
        await this.fsManager.writeFile(GAMES_FILE, JSON.stringify(games));
    }

    async deleteGame(gameId: string) {
        let games = await this.getAllGames();
        games = games.filter((game) => game.id !== gameId);
        await this.fsManager.writeFile(GAMES_FILE, JSON.stringify(games));
    }
}

export default GameService;
