import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useSocket } from "@/hooks";
import toast from "react-hot-toast";
import type { Post, User } from "@shared/types";

const PREVIEW_CHAR_LIMIT = 250;
const SAVED_TIMER = 10000;

const initDraft = (): { body: string; tags: string[] } => {
    try {
        const raw = localStorage.getItem("draft-post");
        if (!raw) return { body: "", tags: [] };

        return JSON.parse(raw);
    } catch (error) {
        console.error("Failed to parse draft post from localStorage", error);
        return { body: "", tags: [] };
    }
};

const initBody: () => string = () => initDraft().body;
const initTags: () => string[] = () => initDraft().tags;

export const usePostComposer = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { publishPostWithWS } = useSocket();
    const saveTimer = useRef<number | null>(null);
    const [body, setBody] = useState(initBody);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [tags, setTags] = useState<string[]>(initTags);

    const previewBody = body.trim() || "You text will be here...";
    const previewExcerpt =
        previewBody.length > PREVIEW_CHAR_LIMIT
            ? `${previewBody.slice(0, PREVIEW_CHAR_LIMIT).trimEnd()}...`
            : previewBody;

    const {
        data: currentUser,
        isLoading,
        isError,
    } = useQuery<User>({ queryKey: ["me"], queryFn: apiClient.me, staleTime: 30 * 60 * 1000 });

    const handleSaveDraft = useCallback(() => {
        localStorage.setItem("draft-post", JSON.stringify({ body, tags }));
        toast.success("Draft saved locally");
    }, [body, tags]);

    const handleAddTag = useCallback(
        (newTag: string) => {
            if (newTag !== "" && !tags.includes(newTag)) {
                setTags((prev) => [...prev, newTag]);
                setIsAddingTag(false);
                return;
            }

            setIsAddingTag(false);
        },
        [tags],
    );

    const handleToggleTag = useCallback((tag: string) => {
        setTags((prev) => prev.filter((el) => el !== tag));
    }, []);

    const onClose = useCallback(() => navigate(-1), [navigate]);

    const handlePostSubmit = useCallback(async () => {
        try {
            const post = await apiClient.postOnePost({
                content: body,
                tags: tags,
                techStack: ["React", "TypeScript"],
                codeSnippet: null,
                comments: [],
                image: null,
            });

            publishPostWithWS({ post });

            queryClient.setQueryData(["feed"], (oldData: Post[] | undefined) => {
                if (!oldData) return [post];
                if (post.id && oldData.some((p) => p.id === post.id)) return oldData;
                return [...oldData, post];
            });
            localStorage.removeItem("draft-post");
            onClose();
        } catch (error) {
            console.error("Failed to create post", error);
            toast.error("Failed to create post");
        }
    }, [body, tags, publishPostWithWS, queryClient, onClose]);

    useEffect(() => {
        saveTimer.current = setInterval(() => {
            handleSaveDraft();
        }, SAVED_TIMER);

        return () => {
            if (saveTimer.current) {
                clearInterval(saveTimer.current);
            }
        };
    }, [handleSaveDraft]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return {
        body,
        setBody,
        tags,
        setTags,
        isPreviewOpen,
        setIsPreviewOpen,
        isAddingTag,
        setIsAddingTag,
        previewBody,
        previewExcerpt,
        currentUser,
        isLoading,
        isError,
        handleSaveDraft,
        handleAddTag,
        handleToggleTag,
        handlePostSubmit,
        onClose,
    };
};
