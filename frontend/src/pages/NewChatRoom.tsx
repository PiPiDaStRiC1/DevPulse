import { useEffect, useState } from "react";
import { ErrorAlert, ChatRoomHeader } from "@/components";
import { Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "@/hooks";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";
import type { ChatDTO } from "@shared/types";

export const NewChatRoom = () => {
    const { user: me } = useSession();
    const navigate = useNavigate();
    const [draft, setDraft] = useState("");
    const { handle } = useParams<{ handle: string }>();
    const isMe = Boolean(me?.handle === handle);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!handle || !draft.trim() || !me) throw new Error("Failed to create chat: missing data");

        try {
            const collocutor = await apiClient.getOneUserByHandle(handle);
            if (!collocutor) {
                throw new Error("User not found");
            }

            const chatPayload: ChatDTO = {
                collocutorId: collocutor.id,
                lastMessage: { text: draft.trim(), senderId: me.id },
            };

            const createdChat = await apiClient.postOneChat(chatPayload);
            navigate(`/whispers/${createdChat.id}`);
        } catch (err) {
            toast.error("Failed to create chat");
            console.error(err);
        }
    };

    useEffect(() => {
        if (isMe) {
            navigate(-1);
        }
    }, [isMe, navigate]);

    if (!handle) {
        return <ErrorAlert message="Messages not found" />;
    }

    return (
        <div className="flex-1 flex flex-col bg-bg min-w-0">
            <ChatRoomHeader handle={handle} />
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3" />

            <form
                onSubmit={handleSubmit}
                className="px-4 py-3 border-t-2 border-ink bg-surface shrink-0 flex items-end gap-3"
            >
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Whisper something…"
                    className={[
                        "flex-1 resize-none bg-bg border-2 border-ink rounded-[var(--radius)]",
                        "text-sm text-text-base placeholder:text-subtle px-3 py-2",
                        "outline-none focus:outline-none focus:ring-0 transition-colors",
                    ].join(" ")}
                />
                <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="btn-solid h-full shrink-0"
                >
                    <Send size={14} />
                </button>
            </form>
        </div>
    );
};
