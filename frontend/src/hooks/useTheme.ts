import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const initTheme = (): Theme => {
    try {
        const theme = localStorage.getItem("theme") as Theme | null;
        if (theme !== null) {
            return theme;
        }
        return "light";
    } catch (error) {
        console.error("Error initializing theme:", error);
        return "light";
    }
};

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(initTheme());

    const handleChangeTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return { theme, handleChangeTheme };
};
