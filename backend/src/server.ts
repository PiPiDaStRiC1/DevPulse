import "dotenv/config";
import express from "express";
// import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { postsRouter, authRouter, userRouter, chatRouter, messagesRouter } from "@/routes";
import { verifyToken, prisma } from "./helpers";
import type { SocketMessagePayload, SocketPostPayload, Acknowledgement } from "@shared/types";

const PORT = Number(process.env["PORT"]) || 4000;
const CORS_ORIGIN = process.env["CORS_ORIGIN"] || "http://localhost:5173";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: CORS_ORIGIN } });

// app.use(morgan("tiny"));
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messagesRouter);

io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;

    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }

    try {
        const payload = verifyToken(token);
        socket.data.user = payload;
        return next();
    } catch (error) {
        return next(new Error("Authentication error: Invalid token"));
    }
});

io.on("connection", (socket) => {
    socket.on("connect", () => {
        console.log("A user connected: " + socket.id);
    });

    socket.on("room:join", async (roomId: string, ack: (res: Acknowledgement) => void) => {
        const currentUserId = socket.data.user.userId;
        const chat = await prisma.chat.findFirst({
            where: {
                id: Number(roomId),
                OR: [{ collocutorId: currentUserId }, { userId: currentUserId }],
            },
        });

        if (!chat) {
            return ack({ ok: false, error: "Chat not found or access denied" });
        }

        socket.join(roomId);
        return ack({ ok: true });
    });

    socket.on("chat:message", (payload: SocketMessagePayload) => {
        socket.to(payload.chatId).emit("chat:message:new", payload);
    });

    socket.on("post:publish", (payload: SocketPostPayload, ack: (res: Acknowledgement) => void) => {
        const currentUserId = socket.data.user.userId;
        if (!currentUserId || !payload.post) {
            return ack({ ok: false, error: "Unauthorized or invalid payload" });
        }

        io.emit("post:publish:new", payload);
        return ack({ ok: true });
    });

    socket.on("error", (err) => {
        console.error("Socket error:", err);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected: " + socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
