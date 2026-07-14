import { TopAuthors, TopPosts } from "@/components";

export const TopPanel = () => {
    return (
        <aside className="space-y-4">
            <div className="card p-4">
                <h3 className="mb-4 font-extrabold">Top This Week</h3>

                <TopPosts />
            </div>

            <div className="card p-4">
                <h3 className="mb-4 font-extrabold">Top Authors</h3>
                <TopAuthors />
            </div>
        </aside>
    );
};
