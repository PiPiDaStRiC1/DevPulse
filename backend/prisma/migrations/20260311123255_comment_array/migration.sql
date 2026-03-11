/*
  Warnings:

  - You are about to drop the column `name` on the `PostComment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[postId]` on the table `CodeSnippet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `PostComment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "reposts" INTEGER NOT NULL,
    "bookmarks" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "isLiked" BOOLEAN NOT NULL,
    "isBookmarked" BOOLEAN NOT NULL,
    "isReposted" BOOLEAN NOT NULL,
    "image" TEXT,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorId", "bookmarks", "content", "createdAt", "id", "image", "isBookmarked", "isLiked", "isReposted", "likes", "reposts") SELECT "authorId", "bookmarks", "content", "createdAt", "id", "image", "isBookmarked", "isLiked", "isReposted", "likes", "reposts" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE TABLE "new_PostComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "PostComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PostComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PostComment" ("id", "postId") SELECT "id", "postId" FROM "PostComment";
DROP TABLE "PostComment";
ALTER TABLE "new_PostComment" RENAME TO "PostComment";
CREATE TABLE "new_Tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT DEFAULT '',
    "postId" INTEGER NOT NULL,
    CONSTRAINT "Tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tags" ("id", "name", "postId") SELECT "id", "name", "postId" FROM "Tags";
DROP TABLE "Tags";
ALTER TABLE "new_Tags" RENAME TO "Tags";
CREATE TABLE "new_TechStack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT DEFAULT '',
    "postId" INTEGER NOT NULL,
    CONSTRAINT "TechStack_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TechStack" ("id", "name", "postId") SELECT "id", "name", "postId" FROM "TechStack";
DROP TABLE "TechStack";
ALTER TABLE "new_TechStack" RENAME TO "TechStack";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CodeSnippet_postId_key" ON "CodeSnippet"("postId");
