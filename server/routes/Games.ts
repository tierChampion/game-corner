import { HTTP_STATUS } from "../utils/Http";
import { Router, Request, Response } from "express";
import GameService, { Game } from "../services/Games.service";

const router = Router();
const gameService = new GameService();

router.get("/", async (req: Request, res: Response) => {
    try {
        const games = await gameService.getAllGames();
        if (games) {
            const exportGames = games.map((game: Game) => {
                return {
                    _id: game._id.toString(),
                    board: game.board,
                    bank: game.bank,
                    pick: game.pick
                };
            });
            res.status(HTTP_STATUS.SUCCESS).json(exportGames);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send();
        }
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json(err);
    }
});

router.get("/:gameId", async (req: Request, res: Response) => {
    try {
        const game = await gameService.getGame(req.params.gameId);
        if (game) {
            res.status(HTTP_STATUS.SUCCESS).json({
                _id: game._id.toString(),
                board: game.board,
                bank: game.bank,
                pick: game.pick
            });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send();
        }
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json(err);
    }
});

export default router;
