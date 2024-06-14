import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import http from "http";
import { config } from "dotenv";
import roomsRouter from "./routes/Rooms.ts";
import gamesRouter from "./routes/Games.ts";
import ServerWebSocket from "./utils/Socket.ts";
import dbService from "./services/Database.service.ts";

const app = express();
config();

const PORT = process.env.PORT || process.env.DEFAULT_PORT;
const SIZE_LIMIT = "10mb";
const PUBLIC_PATH = path.join(__dirname);

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: SIZE_LIMIT }));
app.use(express.static(PUBLIC_PATH));

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

app.use("/api/rooms", roomsRouter);
app.use("/api/games", gamesRouter);

if (process.env.NODE_ENV === "production") {
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});
} else {
  app.get('*', (req, res) => {
    res.send("Development mode: use Vite server for static files.");
  })
}

const server = http.createServer(app);
const serverSocket = new ServerWebSocket();

server.on("upgrade", (request, socket, head) => {
  console.log(request.url);
  if (request.url === '/ws') {
    serverSocket.requestConnection(request, socket, head);
  } else {
    socket.destroy();
  }
});
server.listen(PORT, async () => {
    dbService.connect(process.env.DB_URL!).then(() => {
        console.log(`Listening on port ${PORT}`);
    });
});


