export const FollowingSkeleton = () => {
    return (
        <div className="flex flex-col gap-3 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="h-8 w-10 bg-gray-300" />
                <div className="h-8 bg-gray-300 rounded w-full"></div>
            </div>
            <div className="flex items-center gap-4">
                <div className="h-8 w-10 bg-gray-300" />
                <div className="h-8 bg-gray-300 rounded w-full"></div>
            </div>
            <div className="flex items-center gap-4">
                <div className="h-8 w-10 bg-gray-300" />
                <div className="h-8 bg-gray-300 rounded w-full"></div>
            </div>
            <div className="flex items-center gap-4">
                <div className="h-8 w-10 bg-gray-300" />
                <div className="h-8 bg-gray-300 rounded w-full"></div>
            </div>
        </div>
    );
};
