import { HTTP_STATUS } from "../utils/Http";
import { Router, Request, Response } from "express";
import RoomService, { Room } from "../services/Rooms.service";

const router = Router();
const roomService = new RoomService();

router.get("/", async (req: Request, res: Response) => {
    try {
        const rooms = await roomService.getAllRooms();
        if (rooms) {
            const exportRooms = rooms.map((room: Room) => {
                return { _id: room._id.toString(), members: room.members };
            });
            res.status(HTTP_STATUS.SUCCESS).json(exportRooms);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send();
        }
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json(err);
    }
});

router.get("/:roomId", async (req: Request, res: Response) => {
    try {
        const room = await roomService.getRoom(req.params.roomId);
        if (room) {
            res.status(HTTP_STATUS.SUCCESS).json(
                { _id: room._id.toString(), members: room.members });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send();
        }
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json(err);
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const newRoom = await roomService.createNewRoom();
        res.status(HTTP_STATUS.CREATED).json(
            { _id: newRoom._id.toString(), members: newRoom.members });
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json(err);
    }
});

export default router;