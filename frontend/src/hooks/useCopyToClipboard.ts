import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export const useCopyToClipboard = () => {
    const [isCopied, setIsCopied] = useState(false);
    const timerRef = useRef<number | null>(null);

    const copy = (text: string = "") => {
        const rowUrl = `${window.location.href}${text}`;
        const parsedUrl = rowUrl.replace(/(#[A-ZА-ЯЁa-zа-яё]+)*/gi, "");

        navigator.clipboard.writeText(parsedUrl);

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
