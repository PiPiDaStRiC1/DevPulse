import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { postsRouter, authRouter, userRouter, chatRouter, messagesRouter } from "@/routes";

const PORT = Number(process.env["PORT"]) || 4000;
const CORS_ORIGIN = process.env["CORS_ORIGIN"] || "http://localhost:5173";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: CORS_ORIGIN } });

app.use(morgan("tiny"));
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messagesRouter);

io.on("connection", (socket) => {
    console.log("User`s rooms: " + JSON.stringify(socket.rooms));
    console.log("A user connected: " + socket.id);

    socket.on("chat:message", (message) => {
        console.log("New message: " + message);
    });

    socket.on("room:join", (room: string) => {
        socket.join(room);
        console.log(`User ${socket.id} joining room: ${room}`);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected: " + socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket.IO enabled with CORS origin: ${CORS_ORIGIN}`);
});
