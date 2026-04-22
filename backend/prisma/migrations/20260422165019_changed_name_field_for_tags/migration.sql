-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT '',
    "postId" INTEGER NOT NULL,
    CONSTRAINT "Tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tags" ("id", "name", "postId") SELECT "id", coalesce("name", '') AS "name", "postId" FROM "Tags";
DROP TABLE "Tags";
ALTER TABLE "new_Tags" RENAME TO "Tags";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
