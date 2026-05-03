import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { postsRouter, authRouter, userRouter, chatRouter, messagesRouter } from "@/routes";
import type { SocketMessagePayload } from "@shared/types";

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
    socket.on("connect", () => {
        console.log("A user connected: " + socket.id);
    });

    socket.on("room:join", (roomId: string) => {
        socket.join(roomId);
    });

    socket.on("chat:message", (payload: SocketMessagePayload) => {
        socket.to(payload.chatId).emit("chat:message:new", payload);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected: " + socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
