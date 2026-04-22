-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TechStack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT '',
    "postId" INTEGER NOT NULL,
    CONSTRAINT "TechStack_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TechStack" ("id", "name", "postId") SELECT "id", coalesce("name", '') AS "name", "postId" FROM "TechStack";
DROP TABLE "TechStack";
ALTER TABLE "new_TechStack" RENAME TO "TechStack";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
