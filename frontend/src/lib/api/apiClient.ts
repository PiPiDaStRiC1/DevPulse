import { genericFetch } from "@/lib/utils";
import type { RegisterSchema, LoginSchema } from "@shared/schemas";
import type { Post, AuthResponse } from "@shared/types";

const API_URL = import.meta.env["VITE_API_URL"];

const initJWT = () => {
    try {
        const raw = localStorage.getItem("access-token");
        const parsed = raw ? JSON.parse(raw) : null;

        if (typeof parsed === "string") {
            return parsed;
        }

        return null;
    } catch (error) {
        console.error("Failed to parse JWT from localStorage:", error);
        localStorage.removeItem("access-token");
        return null;
    }
};

const JWTheaders = () => {
    const token = initJWT();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiClient = {
    async me() {},
    async register(registerData: Omit<RegisterSchema, "confirmPassword">) {
        try {
            const response = await genericFetch<AuthResponse>(`${API_URL}/auth/register`, {
                method: "POST",
                body: JSON.stringify(registerData),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to register");
        }
    },
    async login(loginData: LoginSchema) {
        try {
            const response = await genericFetch<AuthResponse>(`${API_URL}/auth/login`, {
                method: "POST",
                body: JSON.stringify(loginData),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to login");
        }
    },
    async getAllPosts() {
        try {
            const data = await genericFetch<Post[]>(`${API_URL}/posts`, {
                headers: { ...JWTheaders() },
            });
            return data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to fetch posts");
        }
    },
    async getOnePost(id: string) {
        try {
            const data = await genericFetch<Post>(`${API_URL}/posts/${id}`, {
                headers: { ...JWTheaders() },
            });
            return data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to fetch post");
        }
    },
    async postOnePost(postData: Post) {
        try {
            const data = await genericFetch<Post>(`${API_URL}/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...JWTheaders() },
                body: JSON.stringify(postData),
            });
            return data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to create post");
        }
    },
};
