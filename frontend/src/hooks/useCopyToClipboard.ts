import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export const useCopyToClipboard = () => {
    const [isCopied, setIsCopied] = useState(false);
    const timerRef = useRef<number | null>(null);

    const copy = (text: string = "") => {
        const url = `${window.location.href}${text}`;

        navigator.clipboard.writeText(url);

        setIsCopied(true);
        toast.success("Link copied to clipboard!");

        timerRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    };

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);

    return { copy, isCopied };
};
