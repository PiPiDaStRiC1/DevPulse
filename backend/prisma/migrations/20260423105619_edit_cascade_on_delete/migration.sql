-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CodeSnippet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "language" TEXT,
    "code" TEXT,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "CodeSnippet_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CodeSnippet" ("code", "id", "language", "postId") SELECT "code", "id", "language", "postId" FROM "CodeSnippet";
DROP TABLE "CodeSnippet";
ALTER TABLE "new_CodeSnippet" RENAME TO "CodeSnippet";
CREATE UNIQUE INDEX "CodeSnippet_postId_key" ON "CodeSnippet"("postId");
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "reposts" INTEGER NOT NULL DEFAULT 0,
    "bookmarks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isLiked" BOOLEAN NOT NULL DEFAULT false,
    "isBookmarked" BOOLEAN NOT NULL DEFAULT false,
    "isReposted" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorId", "bookmarks", "content", "createdAt", "id", "image", "isBookmarked", "isLiked", "isReposted", "likes", "reposts") SELECT "authorId", "bookmarks", "content", "createdAt", "id", "image", "isBookmarked", "isLiked", "isReposted", "likes", "reposts" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE TABLE "new_PostComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "PostComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PostComment" ("authorId", "createdAt", "id", "postId", "text") SELECT "authorId", "createdAt", "id", "postId", "text" FROM "PostComment";
DROP TABLE "PostComment";
ALTER TABLE "new_PostComment" RENAME TO "PostComment";
CREATE TABLE "new_Tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT '',
    "postId" INTEGER NOT NULL,
    CONSTRAINT "Tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tags" ("id", "name", "postId") SELECT "id", "name", "postId" FROM "Tags";
DROP TABLE "Tags";
ALTER TABLE "new_Tags" RENAME TO "Tags";
CREATE TABLE "new_TechStack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT '',
    "postId" INTEGER NOT NULL,
    CONSTRAINT "TechStack_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TechStack" ("id", "name", "postId") SELECT "id", "name", "postId" FROM "TechStack";
DROP TABLE "TechStack";
ALTER TABLE "new_TechStack" RENAME TO "TechStack";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
