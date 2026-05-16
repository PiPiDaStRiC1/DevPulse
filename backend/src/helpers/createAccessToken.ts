import jwt from "jsonwebtoken";

export const createAccessToken = (userId: number) => {
    try {
        const SECRET_KEY = process.env["SECRET_KEY"];

        if (!SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined");
        }

        const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "2h" });

        return token;
    } catch (error) {
        throw new Error("Error creating access token");
    }
};
