import { HTTP_STATUS } from "../utils/Http";
import { Router, Request, Response } from "express";
import GameService from "../services/Games.service";

const router = Router();
const gameService = new GameService();

router.get("/", async (req: Request, res: Response) => {
    try {
        const games = await gameService.getAllGames();
        res.status(HTTP_STATUS.SUCCESS).json(games);
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json(err);
    }
});

router.get("/:gameId", async (req: Request, res: Response) => {
    try {
        const game = await gameService.getGame(req.params.gameId);
        res.status(HTTP_STATUS.SUCCESS).json(game);
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json(err);
    }
});

export default router;
