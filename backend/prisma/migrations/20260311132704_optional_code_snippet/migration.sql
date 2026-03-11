-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CodeSnippet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "language" TEXT,
    "code" TEXT,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "CodeSnippet_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CodeSnippet" ("code", "id", "language", "postId") SELECT "code", "id", "language", "postId" FROM "CodeSnippet";
DROP TABLE "CodeSnippet";
ALTER TABLE "new_CodeSnippet" RENAME TO "CodeSnippet";
CREATE UNIQUE INDEX "CodeSnippet_postId_key" ON "CodeSnippet"("postId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
