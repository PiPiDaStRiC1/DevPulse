import { genericFetch } from "@/lib/utils";
import { getAuthToken } from "@/lib/store";
import type { RegisterSchema, LoginSchema } from "@shared/schemas";
import type {
    ApiResponse,
    Post,
    AuthResponse,
    MeResponse,
    RefreshResponse,
    User,
    Chat,
    ChatDTO,
} from "@shared/types";

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
    async getOneUserByHandle(handle: string) {
        try {
            const response = await genericFetch<ApiResponse<User>>(
                `${API_URL}/users/handle/${handle}`,
            );
            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to fetch user");
        }
    },
    async getOneUserById(id: number) {
        try {
            const response = await genericFetch<ApiResponse<User>>(`${API_URL}/users/id/${id}`);
            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to fetch user");
        }
    },
    async getAllPosts() {
        try {
            const response = await genericFetch<ApiResponse<Post[]>>(`${API_URL}/posts`);
            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to fetch posts");
        }
    },
    async getOnePost(id: number) {
        try {
            const response = await genericFetch<ApiResponse<Post>>(`${API_URL}/posts/${id}`);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to fetch post");
        }
    },
    async postOnePost(postData: Post) {
        try {
            const response = await genericFetch<ApiResponse<Post>>(`${API_URL}/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...JWTheaders() },
                body: JSON.stringify(postData),
            });
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to create post");
        }
    },
    async getAllChats() {
        try {
            const response = await genericFetch<ApiResponse<Chat[]>>(`${API_URL}/chats`);
            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to fetch chats");
        }
    },
    async postOneChat(chatData: ChatDTO) {
        try {
            const response = await genericFetch<ApiResponse<Chat>>(`${API_URL}/chats`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...JWTheaders() },
                body: JSON.stringify(chatData),
            });
            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to create chat");
        }
    },
    async getChatMessages(chatId: number) {
        try {
            const response = await genericFetch<ApiResponse<ChatMessage[]>>(
                `${API_URL}/chats/${chatId}/messages`,
            );
            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : "Failed to fetch chat messages",
            );
        }
    },
};
