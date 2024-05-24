import { HTTP_STATUS } from "../utils/Http";
import { Router, Request, Response } from "express";
import RoomService from "../services/Rooms.service";

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

router.get("/:roomId", async (req: Request, res: Response) => {
    try {
        const room = await roomService.getRoom(req.params.roomId);
        res.status(HTTP_STATUS.SUCCESS).json(room);
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