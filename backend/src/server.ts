import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { postsRouter, authRouter } from "@/routes";

const app = express();
const PORT = 4000;

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
