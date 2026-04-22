import type { User, TrendingTopic, SuggestedUser } from "@shared/types";

export const currentUser: User = {
    id: 0,
    username: "You",
    handle: "your_handle",
    bio: "Full-stack dev learning in public 🚀",
    isVerified: false,
    followers: 128,
    following: 94,
    role: "Full-stack Dev",
    email: "you@example.com",
    createdAt: new Date("2023-01-01"),
};

// const users: User[] = [
//     {
//         id: 1,
//         username: "Aiko Tanaka",
//         handle: "aiko_tsx",
//         avatarColor: "#5b21b6",
//         bio: "✨ Frontend wizard | React + TypeScript | Coffee & anime fuel my code",
//         isVerified: true,
//         followers: 4821,
//         following: 387,
//         role: "Senior Frontend Dev",
//     },
//     {
//         id: 2,
//         username: "Riku Nakamura",
//         handle: "riku_devops",
//         avatarColor: "#0369a1",
//         bio: "☁️ DevOps ninja | k8s, Terraform, GitHub Actions | Ship fast, break prod later",
//         isVerified: true,
//         followers: 6103,
//         following: 521,
//         role: "DevOps Engineer",
//     },
//     {
//         id: 3,
//         username: "Hana Mori",
//         handle: "hana_designs",
//         avatarColor: "#15803d",
//         bio: "🎨 UI/UX Designer & Dev | Figma → React | Making beautiful things",
//         isVerified: false,
//         followers: 2247,
//         following: 310,
//         role: "UI/UX Designer",
//     },
//     {
//         id: 4,
//         username: "Kaito Sato",
//         handle: "kaito_rust",
//         avatarColor: "#b45309",
//         bio: "🦀 Rust evangelist | Systems programmer | Memory safety is a lifestyle",
//         isVerified: true,
//         followers: 8934,
//         following: 205,
//         role: "Systems Engineer",
//     },
//     {
//         id: 5,
//         username: "Yuki Chen",
//         handle: "yuki_ai",
//         avatarColor: "#0f766e",
//         bio: "🤖 ML engineer | PyTorch, transformers, vibes | PhD dropout turned builder",
//         isVerified: false,
//         followers: 3512,
//         following: 432,
//         role: "ML Engineer",
//     },
//     {
//         id: 6,
//         username: "Sora Ishida",
//         handle: "sora_fullstack",
//         avatarColor: "#be185d",
//         bio: "⚡ Next.js + Prisma enjoyer | OSS contributor | Always learning",
//         isVerified: false,
//         followers: 1893,
//         following: 567,
//         role: "Full-Stack Dev",
//     },
// ];

// const u = (i: number): User => users[i] as User;

// export const mockPosts: Post[] = [
//     {
//         id: "p1",
//         author: u(0),
//         content:
//             "How we cut form bugs by 40% in 2 sprints\n\nWe replaced our old form setup with a schema-first approach and isolated field components. The biggest win was consistency across validation and UI states.\n\nIf your forms feel fragile, start by standardizing error and loading patterns.",
//         tags: ["#TanStackForm", "#React"],
//         techStack: ["React", "TypeScript", "TanStack"],
//         likes: 284,
//         comments: 47,
//         reposts: 62,
//         bookmarks: 91,
//         createdAt: "2h",
//         isLiked: true,
//         isBookmarked: false,
//         isReposted: false,
//     },
//     {
//         id: "p2",
//         author: u(1),
//         content:
//             "Your docker-compose file is your onboarding document\n\nA new teammate should run one command and get the whole stack up. If they need 12 README steps, your DX is leaking time.\n\nHere is the compose baseline we use in every project:",
//         tags: ["#Docker", "#DevOps"],
//         techStack: ["Docker", "Kubernetes", "Redis"],
//         likes: 512,
//         comments: 89,
//         reposts: 143,
//         bookmarks: 207,
//         createdAt: "4h",
//         isLiked: false,
//         isBookmarked: true,
//         isReposted: false,
//         codeSnippet: {
//             language: "yaml",
//             code: `services:
//   app:
//     build: .
//     ports: ["3000:3000"]
//     depends_on: [db, redis]
//     environment:
//       DATABASE_URL: postgres://dev:dev@db:5432/app
//       REDIS_URL: redis://redis:6379

//   db:
//     image: postgres:16-alpine
//     environment:
//       POSTGRES_PASSWORD: dev
//       POSTGRES_USER: dev
//       POSTGRES_DB: app

//   redis:
//     image: redis:7-alpine`,
//         },
//     },
//     {
//         id: "p3",
//         author: u(2),
//         content:
//             "I redesigned our dashboard and users finally scan it in seconds\n\nThe old version had visual noise everywhere. We moved to a strict spacing scale, one accent color, and clear action hierarchy.\n\nResult: usability score from 6.2 to 8.9 in two rounds of tests.",
//         tags: ["#UIDesign", "#Figma"],
//         techStack: ["Figma", "React", "CSS"],
//         likes: 731,
//         comments: 103,
//         reposts: 198,
//         bookmarks: 444,
//         createdAt: "6h",
//         isLiked: true,
//         isBookmarked: true,
//         isReposted: true,
//         image: "gradient",
//     },
//     {
//         id: "p4",
//         author: u(3),
//         content:
//             "Rust ownership finally clicked for me\n\nBorrowing is not just strictness for strictness sake. It removes whole classes of runtime bugs before code even ships.\n\nI wish I had this feedback loop years ago.",
//         tags: ["#Rust", "#SystemsProgramming"],
//         techStack: ["Rust", "WebAssembly"],
//         likes: 1042,
//         comments: 178,
//         reposts: 312,
//         bookmarks: 589,
//         createdAt: "9h",
//         isLiked: false,
//         isBookmarked: false,
//         isReposted: false,
//         codeSnippet: {
//             language: "rust",
//             code: `fn process(data: Vec<String>) -> Vec<String> {
//     data.iter()
//         .filter(|s| !s.is_empty())
//         .map(|s| s.to_uppercase())
//         .collect()
//     // data is borrowed, not moved — zero copies!
// }`,
//         },
//     },
//     {
//         id: "p5",
//         author: u(4),
//         content:
//             "Small model, domain data, better suggestions\n\nWe fine-tuned a compact LLM on our internal code style. In testing, accepted suggestions jumped from 61% to 74%.\n\nTakeaway: alignment to your codebase beats raw model size in many workflows.",
//         tags: ["#MachineLearning", "#LLM"],
//         techStack: ["Python", "PyTorch", "HuggingFace"],
//         likes: 2183,
//         comments: 294,
//         reposts: 718,
//         bookmarks: 1024,
//         createdAt: "12h",
//         isLiked: true,
//         isBookmarked: true,
//         isReposted: false,
//     },
//     {
//         id: "p6",
//         author: u(5),
//         content:
//             "I shipped my first open-source package today\n\nIt started as internal middleware for rate limiting and evolved into a tiny reusable helper.\n\nIf this helps even a small team avoid one outage, that is enough.",
//         tags: ["#OSS", "#NextJS"],
//         techStack: ["Next.js", "TypeScript", "Redis"],
//         likes: 387,
//         comments: 52,
//         reposts: 84,
//         bookmarks: 139,
//         createdAt: "1d",
//         isLiked: false,
//         isBookmarked: false,
//         isReposted: false,
//     },
// ];

export const trendingTopics: TrendingTopic[] = [
    { id: 0, tag: "TypeScript", posts: 12400, category: "Language" },
    { id: 1, tag: "ReactServer", posts: 8710, category: "Framework" },
    { id: 2, tag: "Rust2025", posts: 6230, category: "Language" },
    { id: 3, tag: "AICodeReview", posts: 5980, category: "AI/ML" },
    { id: 4, tag: "OpenSource", posts: 4410, category: "Community" },
];

export const suggestedUsers: SuggestedUser[] = [
    { ...currentUser, id: 0, username: "john_doe", mutualFollowers: 18 },
    { ...currentUser, id: 1, username: "jane_smith", mutualFollowers: 11 },
    { ...currentUser, id: 2, username: "alice_jones", mutualFollowers: 7 },
];
