import { HTTP_STATUS } from "../utils/Http.ts";
import { Request, Response } from "express";
import {Router} from "express";
import RoomService from "../services/Rooms.service.ts";

const router = Router();
const roomService = new RoomService();

router.get("/", async (req: Request, res: Response) => {
    try {
        const rooms = await roomService.getAllRooms();
        res.status(HTTP_STATUS.SUCCESS).json(rooms);
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json(err);
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const newRoom = await roomService.createNewRoom();
        res.status(HTTP_STATUS.CREATED).json(newRoom);
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json(err);
    }
});

export default router;