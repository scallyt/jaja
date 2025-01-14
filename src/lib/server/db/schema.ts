import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { randomUUID, randomBytes } from "node:crypto";

export const fileTable = sqliteTable("file", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUID()),
    filename: text("filename"),
    userId: text("userId")
        .references(() => user.id)
        .notNull(),
    collectionId: text("collectionId").references(() => collection.id),
    createdAt: integer("createdAt").$defaultFn(() =>
        Math.floor(Date.now() / 1000),
    ),
    languageFrom: text("languageFrom").notNull(),
    languageTo: text("languageTo").notNull(),
});

export const collection = sqliteTable("collection", {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    userId: text("userId").references(() => user.id).notNull()
})

export const emailVerifyCode = sqliteTable("emailVerifyCode", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUID()),
    userId: text("userId")
        .references(() => user.id)
        .notNull(),
    code: text("code", { length: 6 }).notNull().$defaultFn(() => generateRandomCode(6))
})

export const user = sqliteTable("user", {
    id: text("id")
        .primaryKey()
        .$default(() => randomUUID()),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    emailVerify: integer("emailVerify", { mode: "boolean" }).$default(
        () => false,
    ),
    passwordHash: text("password_hash").notNull(),
    tokens: integer("token")
        .notNull()
        .$default(() => 0),
});

export const session = sqliteTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;


function generateRandomCode(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';

    const random = randomBytes(length);
    for (let i = 0; i < length; i++) {
        const randomIndex = random[i] % charactersLength;
        result += characters[randomIndex];
    }

    return result;
}