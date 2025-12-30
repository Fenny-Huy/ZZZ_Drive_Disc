import { relations } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `zzz_t3_${name}`);

// Artifact tables
export const artifactItself = createTable(
  "drive_disc",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    set: d.varchar({ length: 255 }),
    type: d.varchar({ length: 50 }),
    mainStat: d.varchar({ length: 50 }),
    numberOfSubstat: d.integer(),
    percentATK: d.integer().default(0),
    percentHP: d.integer().default(0),
    percentDEF: d.integer().default(0),
    atk: d.integer().default(0),
    hp: d.integer().default(0),
    def: d.integer().default(0),
    pen: d.integer().default(0),
    ap: d.integer().default(0),
    critRate: d.integer().default(0),
    critDMG: d.integer().default(0),
    whereGotIt: d.varchar({ length: 50 }),
    score: d.varchar({ length: 50 }),
    createDate: d
      .timestamp({ mode: "date" })
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [
    index("drive_disc_user_id_idx").on(t.userId),
    index("drive_disc_set_idx").on(t.set),
  ],
);

export const artifactLeveling = createTable(
  "drive_disc_leveling",
  (d) => ({
    id: d
      .integer()
      .primaryKey()
      .references(() => artifactItself.id, { onDelete: "cascade" }),
    lHP: d.integer().default(0),
    lATK: d.integer().default(0),
    lDEF: d.integer().default(0),
    lPercentHP: d.integer().default(0),
    lPercentATK: d.integer().default(0),
    lPercentDEF: d.integer().default(0),
    lAP: d.integer().default(0),
    lPEN: d.integer().default(0),
    lCritRate: d.integer().default(0),
    lCritDMG: d.integer().default(0),
    addedSubstat: d.varchar({ length: 20 }).default("None"),
    createDate: d
      .timestamp({ mode: "date" })
      .$defaultFn(() => new Date())
      .notNull(),
    lastAdded: d
      .timestamp({ mode: "date" })
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [index("drive_disc_leveling_id_idx").on(t.id)],
);

// Relations
export const artifactItselfRelations = relations(artifactItself, ({ one }) => ({
  user: one(users, {
    fields: [artifactItself.userId],
    references: [users.id],
  }),
  leveling: one(artifactLeveling, {
    fields: [artifactItself.id],
    references: [artifactLeveling.id],
  }),
}));

export const artifactLevelingRelations = relations(
  artifactLeveling,
  ({ one }) => ({
    artifact: one(artifactItself, {
      fields: [artifactLeveling.id],
      references: [artifactItself.id],
    }),
  }),
);

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .$defaultFn(() => /* @__PURE__ */ new Date()),
  image: d.varchar({ length: 255 }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  artifacts: many(artifactItself),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);
