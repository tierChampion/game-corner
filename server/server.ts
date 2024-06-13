import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { config } from "dotenv";
import roomsRouter from "./routes/Rooms.ts";
import gamesRouter from "./routes/Games.ts";
import ServerWebSocket from "./utils/Socket.ts";
import dbService from "./services/Database.service.ts";

const app = express();
config();

const PORT = process.env.SERVER_PORT;
const SIZE_LIMIT = "10mb";
const PUBLIC_PATH = path.join(__dirname);

app.use(cors({ origin: '*' }));

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`New HTTP request: ${req.method} ${req.url}`);
    next();
});

// app.use((req, res, next) => {
//   if (req.headers['x-forwarded-proto'] !== 'https') {
//     return res.redirect(['https://', req.get('Host'), req.url].join(''));
//   }
//   next();
// });

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: SIZE_LIMIT }));
app.use(express.static(PUBLIC_PATH));

app.use("/api/rooms", roomsRouter);
app.use("/api/games", gamesRouter);

const SOCKET_PORT = parseInt(process.env.SOCKET_PORT || "");
const socket = new ServerWebSocket(SOCKET_PORT);

if (process.env.NODE_ENV === "prod") {
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});
} else {
  app.get('*', (req, res) => {
    res.send("Development mode: use Vite server for static files.");
  })
}

const server = app.listen(PORT, async () => {
    dbService.connect(process.env.DB_URL!).then(() => {
        console.log(`Listening on port ${PORT}`);
    });
});
