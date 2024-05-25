import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { config } from "dotenv";
import roomsRouter from "./routes/Rooms.ts";
import gamesRouter from "./routes/Games.ts";
import ServerWebSocket from "./utils/Socket.ts";

const app = express();
config();

const PORT = process.env.PORT;
const SIZE_LIMIT = "10mb";
const PUBLIC_PATH = path.join(__dirname);

app.use(cors({ origin: '*' }));

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`New HTTP request: ${req.method} ${req.url}`);
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: SIZE_LIMIT }));
app.use(express.static(PUBLIC_PATH));

app.use("/api/rooms", roomsRouter);
app.use("/api/games", gamesRouter);

const SOCKET_PORT = parseInt(process.env.SOCKET_PORT || "");
const socket = new ServerWebSocket(SOCKET_PORT);

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
