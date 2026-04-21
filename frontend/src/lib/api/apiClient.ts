import { genericFetch } from "@/lib/utils";
import { getAuthToken } from "@/lib/store";
import type { RegisterSchema, LoginSchema } from "@shared/schemas";
import type { Post, AuthResponse, MeResponse, RefreshResponse } from "@shared/types";

const API_URL = import.meta.env["VITE_API_URL"];

const JWTheaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiClient = {
    async me() {
        try {
            const response = await genericFetch<MeResponse>(`${API_URL}/auth/me`, {
                headers: { ...JWTheaders() },
            });

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to fetch profile");
        }
    },
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
    async refresh() {
        try {
            const response = await genericFetch<RefreshResponse>(`${API_URL}/auth/refresh`);

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to refresh token");
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
