import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useSocket } from "@/hooks";
import toast from "react-hot-toast";
import type { Post, User } from "@shared/types";

const PREVIEW_CHAR_LIMIT = 250;
const SAVED_TIMER = 30000;

interface InitDraft {
    heading: string;
    body: string;
    tags: string[];
}

const initDraft = (): InitDraft => {
    try {
        const raw = localStorage.getItem("draft-post");
        if (!raw) return { heading: "", body: "", tags: [] };

        const parsed = JSON.parse(raw) as Partial<InitDraft>;

        return { heading: parsed.heading ?? "", body: parsed.body ?? "", tags: parsed.tags ?? [] };
    } catch (error) {
        console.error("Failed to parse draft post from localStorage", error);
        return { heading: "", body: "", tags: [] };
    }
};

const initBody: () => string = () => initDraft().body;
const initTags: () => string[] = () => initDraft().tags;
const initHeading: () => string = () => initDraft().heading;

export const usePostComposer = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { publishPostWithWS } = useSocket();
    const saveTimer = useRef<number | null>(null);
    const [body, setBody] = useState(initBody);
    const [heading, setHeading] = useState(initHeading);
    const [tags, setTags] = useState(initTags);
    const [isAddingTag, setIsAddingTag] = useState(false);

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
        localStorage.setItem("draft-post", JSON.stringify({ body, tags, heading }));
        toast.success("Draft saved locally");
    }, [body, tags, heading]);

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
            const newPost = await apiClient.postOnePost({
                title: heading,
                coverImage: null,
                content: body,
                tags: tags,
                techStack: ["React", "TypeScript"],
                codeSnippet: null,
                comments: [],
                image: null,
                isLiked: false,
                likes: 0,
            });

            publishPostWithWS({ post: newPost });

            queryClient.setQueryData(["feed"], (oldData: Post[] | undefined) => {
                if (!oldData) return [newPost];
                if (newPost.id && oldData.some((p) => p.id === newPost.id)) return oldData;
                return [newPost, ...oldData];
            });
            localStorage.removeItem("draft-post");
            onClose();
        } catch (error) {
            console.error("Failed to create post", error);
            if (error instanceof Error) {
                toast.error(error.message || "Failed to create post");
            }
        }
    }, [body, heading, tags, publishPostWithWS, queryClient, onClose]);

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

    return {
        body,
        setBody,
        heading,
        setHeading,
        tags,
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
