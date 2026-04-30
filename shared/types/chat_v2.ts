// Improved chat types and Prisma model suggestion

// Lightweight user summary stored with conversations to avoid loading full profile repeatedly
export interface UserSummary {
    id: number;
    username: string;
    handle: string;
    avatar?: string | null; // url or null
    isVerified?: boolean;
}

export interface Message {
    id: number;
    chatId: number;
    senderId: number;
    text: string;
    createdAt: string; // ISO
    delivered?: boolean; // server-side delivery flag
    readBy?: number[]; // ids of users who read this message (optional)
    clientId?: string; // optional id assigned by client for idempotency
}

// Conversation (chat) stored in DB should be minimal for listing: a small participants summary
export interface Conversation {
    id: number;
    participants: UserSummary[]; // small summary for listing
    lastMessage?: Message;
    unreadCount?: number; // unread for current user (calculated server-side)
    updatedAt: string; // last activity
    // optional metadata for client-side features
    metadata?: { archived?: boolean; muted?: boolean };
}

// When the client needs a full profile, it should call `/api/users/:id` to fetch the complete user object.
// This keeps `Conversation` lightweight and fast for lists.

/* Prisma schema suggestion (for backend/prisma/schema.prisma)

model Chat {
  id         Int       @id @default(autoincrement())
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  participants ChatParticipant[]
  messages   Message[]
}

model ChatParticipant {
  id       Int   @id @default(autoincrement())
  chat     Chat  @relation(fields: [chatId], references: [id], onDelete: Cascade)
  chatId   Int
  user     User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId   Int
  // per-user flags (muted, archived)
  muted    Boolean @default(false)
  archived Boolean @default(false)
}

model Message {
  id        Int      @id @default(autoincrement())
  chat      Chat     @relation(fields: [chatId], references: [id], onDelete: Cascade)
  chatId    Int
  sender    User     @relation(fields: [senderId], references: [id], onDelete: Cascade)
  senderId  Int
  text      String
  clientId  String?  @unique
  createdAt DateTime @default(now())
  // read receipts are modeled separately to avoid large arrays on Message
}

// Optional read receipt table
model MessageRead {
  id        Int     @id @default(autoincrement())
  message   Message @relation(fields: [messageId], references: [id], onDelete: Cascade)
  messageId Int
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    Int
  readAt    DateTime @default(now())
}

Design notes:
- Keep conversation list lightweight: only show `UserSummary` for participants and `lastMessage`.
- Store per-user flags (muted/archived) in `ChatParticipant` so you can filter server-side without loading full profile.
- Use `clientId` for idempotency when clients resend messages after reconnect.
- Read receipts stored in separate table `MessageRead` to avoid denormalized arrays on Message rows.
- To show a full profile, client calls `/api/users/:id`.

*/
