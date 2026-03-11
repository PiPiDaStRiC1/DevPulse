import { genericFetch } from "@/lib/utils";
import type { Post } from "@shared/types";

const API_URL = import.meta.env["VITE_API_URL"];

export const apiClient = {
    async getAllPosts() {
        try {
            const response = await genericFetch<Post[]>(`${API_URL}/posts`);
            return response;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to fetch posts");
        }
    },
    async getOnePost(id: string) {
        try {
            const response = await genericFetch<Post>(`${API_URL}/posts/${id}`);
            return response;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to fetch post");
        }
    },
    async postOnePost(data: Post) {
        try {
            const response = await genericFetch<Post>(`${API_URL}/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            return response;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create post");
        }
    },
};
