import { Link } from "react-router-dom";
import { ActivityIcon } from "lucide-react";

export const Logo = () => {
    return (
        <Link to="/" aria-label="DevPulse Logo" className="cursor-pointer flex items-center gap-2">
            <ActivityIcon size={16} className="text-black" />
            <span className="select-none text-lg text-gray-900 font-semibold">DevPulse</span>
        </Link>
    );
};
