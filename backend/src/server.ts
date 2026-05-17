import "dotenv/config";
import express from "express";
// import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { postsRouter, authRouter, userRouter, chatRouter, messagesRouter } from "@/routes";
import { verifyToken, prisma } from "./helpers";
import type {
    SocketMessagePayload,
    SocketPostPayload,
    SocketReadChatPayload,
    SocketConnection,
    Acknowledgement,
    ChatOnlineAcknowledgement,
    SocketTypingMessagePayload,
} from "@shared/types";

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

const onlineUsers = new Map<number, Set<string>>();

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
    const currentUserId = socket.data.user.userId;
    console.log(`A user connected: ${socket.id} (User ID: ${currentUserId})`);
    const connectionPayload: SocketConnection = { userId: currentUserId };

    if (!onlineUsers.has(currentUserId)) {
        onlineUsers.set(currentUserId, new Set());
        socket.broadcast.emit("user:connected", connectionPayload);
    }
    // Push new socket anyway (for multi-tab support)
    onlineUsers.get(currentUserId)!.add(socket.id);

    socket.on(
        "user:online",
        (payload: SocketConnection, ack: (res: ChatOnlineAcknowledgement) => void) => {
            const userSockets = onlineUsers.get(payload.userId);
            const isUserOnline = !!userSockets && userSockets.size > 0;
            return ack({ ok: true, data: { isUserOnline } });
        },
    );

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

    socket.on("user:typing", (payload: SocketTypingMessagePayload) => {
        socket.to(payload.chatId).emit("user:typing:new", payload);
    });

    socket.on("chat:read", (payload: SocketReadChatPayload) => {
        socket.to(payload.chatId).emit("chat:read:new", payload);
    });

    socket.on("post:publish", (payload: SocketPostPayload, ack: (res: Acknowledgement) => void) => {
        const currentUserId = socket.data.user.userId;
        if (!currentUserId || !payload.post) {
            return ack({ ok: false, error: "Unauthorized or invalid payload" });
        }

        io.emit("post:publish:new", payload);
        return ack({ ok: true });
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected: " + socket.id, `(User ID: ${currentUserId})`);
        if (onlineUsers.has(currentUserId)) {
            const userSockets = onlineUsers.get(currentUserId);

            userSockets?.delete(socket.id);

            if (userSockets && userSockets.size === 0) {
                onlineUsers.delete(currentUserId);
                socket.broadcast.emit("user:disconnected", connectionPayload);
            }
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
