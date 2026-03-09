import type { Post, SuggestedUser, TrendingTopic, User } from "@/types";

export const currentUser: User = {
    id: "0",
    username: "You",
    handle: "your_handle",
    avatarColor: "#0f0f0f",
    bio: "Full-stack dev learning in public 🚀",
    isVerified: false,
    followers: 128,
    following: 94,
    role: "Full-stack Dev",
};

const users: User[] = [
    {
        id: "1",
        username: "Aiko Tanaka",
        handle: "aiko_tsx",
        avatarColor: "#5b21b6",
        bio: "✨ Frontend wizard | React + TypeScript | Coffee & anime fuel my code",
        isVerified: true,
        followers: 4821,
        following: 387,
        role: "Senior Frontend Dev",
    },
    {
        id: "2",
        username: "Riku Nakamura",
        handle: "riku_devops",
        avatarColor: "#0369a1",
        bio: "☁️ DevOps ninja | k8s, Terraform, GitHub Actions | Ship fast, break prod later",
        isVerified: true,
        followers: 6103,
        following: 521,
        role: "DevOps Engineer",
    },
    {
        id: "3",
        username: "Hana Mori",
        handle: "hana_designs",
        avatarColor: "#15803d",
        bio: "🎨 UI/UX Designer & Dev | Figma → React | Making beautiful things",
        isVerified: false,
        followers: 2247,
        following: 310,
        role: "UI/UX Designer",
    },
    {
        id: "4",
        username: "Kaito Sato",
        handle: "kaito_rust",
        avatarColor: "#b45309",
        bio: "🦀 Rust evangelist | Systems programmer | Memory safety is a lifestyle",
        isVerified: true,
        followers: 8934,
        following: 205,
        role: "Systems Engineer",
    },
    {
        id: "5",
        username: "Yuki Chen",
        handle: "yuki_ai",
        avatarColor: "#0f766e",
        bio: "🤖 ML engineer | PyTorch, transformers, vibes | PhD dropout turned builder",
        isVerified: false,
        followers: 3512,
        following: 432,
        role: "ML Engineer",
    },
    {
        id: "6",
        username: "Sora Ishida",
        handle: "sora_fullstack",
        avatarColor: "#be185d",
        bio: "⚡ Next.js + Prisma enjoyer | OSS contributor | Always learning",
        isVerified: false,
        followers: 1893,
        following: 567,
        role: "Full-Stack Dev",
    },
];

const u = (i: number): User => users[i] as User;

export const mockPosts: Post[] = [
    {
        id: "p1",
        author: u(0),
        content:
            "just rewrote our entire forms layer using #TanStackForm and honestly? game changer. no more controlled input hell, no more re-render waterfalls 🔥 if you're still using react-hook-form you owe it to yourself to try it\n\n(yes i know i said the same thing about rqf 6 months ago, i evolve)",
        tags: ["#TanStackForm", "#React"],
        techStack: ["React", "TypeScript", "TanStack"],
        likes: 284,
        comments: 47,
        reposts: 62,
        bookmarks: 91,
        createdAt: "2h",
        isLiked: true,
        isBookmarked: false,
        isReposted: false,
    },
    {
        id: "p2",
        author: u(1),
        content:
            "hot take: your docker-compose.yml IS your documentation. if a new dev can't spin up your entire stack with one command you have failed them\n\nhere's the compose file we use at work — postgres, redis, the app, and a local smtp server all wired up:",
        tags: ["#Docker", "#DevOps"],
        techStack: ["Docker", "Kubernetes", "Redis"],
        likes: 512,
        comments: 89,
        reposts: 143,
        bookmarks: 207,
        createdAt: "4h",
        isLiked: false,
        isBookmarked: true,
        isReposted: false,
        codeSnippet: {
            language: "yaml",
            code: `services:
  app:
    build: .
    ports: ["3000:3000"]
    depends_on: [db, redis]
    environment:
      DATABASE_URL: postgres://dev:dev@db:5432/app
      REDIS_URL: redis://redis:6379

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: dev
      POSTGRES_USER: dev
      POSTGRES_DB: app

  redis:
    image: redis:7-alpine`,
        },
    },
    {
        id: "p3",
        author: u(2),
        content:
            "redesigned our dashboard from scratch. the old one had 14 different shades of grey and 0 visual hierarchy 😭\n\nnew one follows 8px grid, 3-color palette, and every interactive element has a clear hover/focus state. user testing scores went from 6.2 → 8.9 ✨\n\n#UIDesign #Figma #React",
        tags: ["#UIDesign", "#Figma"],
        techStack: ["Figma", "React", "CSS"],
        likes: 731,
        comments: 103,
        reposts: 198,
        bookmarks: 444,
        createdAt: "6h",
        isLiked: true,
        isBookmarked: true,
        isReposted: true,
        image: "gradient",
    },
    {
        id: "p4",
        author: u(3),
        content:
            "Rust's ownership model just clicked for me and now i look at my old TypeScript code like 👁️👄👁️\n\nborrowing literally prevents an entire class of bugs at compile time. no runtime nulls, no race conditions, no use-after-free. the borrow checker is your best pair programmer\n\n#Rust #SystemsProgramming",
        tags: ["#Rust", "#SystemsProgramming"],
        techStack: ["Rust", "WebAssembly"],
        likes: 1042,
        comments: 178,
        reposts: 312,
        bookmarks: 589,
        createdAt: "9h",
        isLiked: false,
        isBookmarked: false,
        isReposted: false,
        codeSnippet: {
            language: "rust",
            code: `fn process(data: Vec<String>) -> Vec<String> {
    data.iter()
        .filter(|s| !s.is_empty())
        .map(|s| s.to_uppercase())
        .collect()
    // data is borrowed, not moved — zero copies!
}`,
        },
    },
    {
        id: "p5",
        author: u(4),
        content:
            "fine-tuned a small LLM on our codebase for autocomplete suggestions and the results are... surprisingly good? 74% of suggestions accepted in user testing vs 61% for GitHub Copilot on our domain-specific code\n\nkey insight: smaller model + domain data >> larger generic model\n\n#MachineLearning #LLM #AI",
        tags: ["#MachineLearning", "#LLM"],
        techStack: ["Python", "PyTorch", "HuggingFace"],
        likes: 2183,
        comments: 294,
        reposts: 718,
        bookmarks: 1024,
        createdAt: "12h",
        isLiked: true,
        isBookmarked: true,
        isReposted: false,
    },
    {
        id: "p6",
        author: u(5),
        content:
            "shipped my first open source library today!! 🎉 it's a tiny Next.js middleware for rate limiting with Redis — zero config, ~200 bytes gzipped\n\nstarted as internal tooling, figured other people might need it too. if it helps even 10 people that's a win 🙏\n\n#OSS #NextJS #OpenSource",
        tags: ["#OSS", "#NextJS"],
        techStack: ["Next.js", "TypeScript", "Redis"],
        likes: 387,
        comments: 52,
        reposts: 84,
        bookmarks: 139,
        createdAt: "1d",
        isLiked: false,
        isBookmarked: false,
        isReposted: false,
    },
];

export const trendingTopics: TrendingTopic[] = [
    { id: "t1", tag: "TypeScript", posts: 12400, category: "Language" },
    { id: "t2", tag: "ReactServer", posts: 8710, category: "Framework" },
    { id: "t3", tag: "Rust2025", posts: 6230, category: "Language" },
    { id: "t4", tag: "AICodeReview", posts: 5980, category: "AI/ML" },
    { id: "t5", tag: "OpenSource", posts: 4410, category: "Community" },
];

export const suggestedUsers: SuggestedUser[] = [
    { ...u(3), mutualFollowers: 18 },
    { ...u(4), mutualFollowers: 11 },
    { ...u(1), mutualFollowers: 7 },
];
