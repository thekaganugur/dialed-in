import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/* --- Enums (adjust values to match your original if needed) --- */
export const roastLevelEnum = pgEnum("roast_level", [
  "light",
  "medium",
  "medium-dark",
  "dark",
]);

export const processEnum = pgEnum("process", [
  "washed",
  "natural",
  "honey",
  "anaerobic",
]);

export const brewMethodEnum = pgEnum("brew_method", [
  "espresso",
  "v60",
  "aeropress",
  "french_press",
  "moka",
  "chemex",
  "turkish",
  "cold_brew",
]);

/* --- Better Auth Users --- */
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

/* --- Coffee Beans --- */
export const coffeeBeans = pgTable(
  "coffee_beans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    roaster: varchar("roaster", { length: 255 }),
    origin: varchar("origin", { length: 255 }),
    roastLevel: roastLevelEnum("roast_level"),
    process: processEnum("process"),
    roastDate: date("roast_date"),
    link: text("link"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    byUserName: index("coffee_beans_user_name_idx").on(t.userId, t.name),
  }),
);

/* --- Grinders --- */
export const grinders = pgTable(
  "grinders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    displayName: varchar("display_name", { length: 100 }).notNull(),
    brand: varchar("brand", { length: 50 }),
    model: varchar("model", { length: 50 }),
    notes: text("notes"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userGrinders: index("grinders_user_active_idx")
      .on(t.userId, t.isActive)
      .where(sql`${t.isActive} = true`),
    displayName: index("grinders_display_name_idx").on(t.displayName),
  }),
);

/* --- Brew Methods --- */
export const brewMethods = pgTable(
  "brew_methods",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: brewMethodEnum("name").notNull(),
    defaultTemp: integer("default_temp"),
    defaultTime: integer("default_time"),
    defaultRatio: varchar("default_ratio", { length: 10 }),
    grindSize: varchar("grind_size", { length: 50 }),
    notes: text("notes"),
  },
  (t) => ({
    methodNameUnique: uniqueIndex("brew_methods_name_key").on(t.name),
  }),
);

/* --- Coffee Logs (main entity) --- */
export const coffeeLogs = pgTable(
  "coffee_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    beanId: uuid("bean_id")
      .notNull()
      .references(() => coffeeBeans.id, { onDelete: "restrict" }),

    method: brewMethodEnum("method").notNull(),

    // single TZ-aware datetime; removed duplicate brewDate
    brewedAt: timestamp("brewed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    doseGrams: numeric("dose_grams", { precision: 5, scale: 2 }),
    yieldGrams: numeric("yield_grams", { precision: 5, scale: 2 }),
    brewTimeSeconds: integer("brew_time_seconds"),
    waterTempCelsius: integer("water_temp_celsius"),
    grinderId: uuid("grinder_id").references(() => grinders.id, {
      onDelete: "set null",
    }),
    grindSetting: varchar("grind_setting", { length: 50 }),

    rating: integer("rating"),

    notes: text("notes"),
    flavorNotes: text("flavor_notes"), // simple text field instead of array
    photoUrl: varchar("photo_url", { length: 500 }),

    isPublic: boolean("is_public").default(false).notNull(),
    deletedAt: timestamp("deleted_at"), // soft delete support

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(), // update in app code or via trigger
  },
  (t) => ({
    byUser: index("coffee_logs_user_idx").on(t.userId),
    byBean: index("coffee_logs_bean_idx").on(t.beanId),
    byMethod: index("coffee_logs_method_idx").on(t.method),
    byTime: index("coffee_logs_brewed_at_idx").on(t.brewedAt),
    // Composite indexes for common query patterns
    byUserTime: index("coffee_logs_user_brewed_at_idx").on(
      t.userId,
      t.brewedAt,
    ),
    byUserMethod: index("coffee_logs_user_method_idx").on(t.userId, t.method),
    // Partial index for active (non-deleted) records
    activeRecords: index("coffee_logs_active_idx")
      .on(t.userId, t.brewedAt)
      .where(sql`${t.deletedAt} is null`),

    ratingRange: check(
      "coffee_logs_rating_range",
      sql`${t.rating} is null or (${t.rating} >= 1 and ${t.rating} <= 5)`,
    ),
    positiveDose: check(
      "coffee_logs_dose_positive",
      sql`${t.doseGrams} is null or ${t.doseGrams} > 0`,
    ),
    positiveYield: check(
      "coffee_logs_yield_positive",
      sql`${t.yieldGrams} is null or ${t.yieldGrams} > 0`,
    ),
  }),
);

/* --- Relations --- */
export const coffeeBeansRelations = relations(coffeeBeans, ({ many }) => ({
  logs: many(coffeeLogs),
}));

export const grindersRelations = relations(grinders, ({ many, one }) => ({
  logs: many(coffeeLogs),
  user: one(user, {
    fields: [grinders.userId],
    references: [user.id],
  }),
}));

// Note: brewMethods table is not directly referenced by coffeeLogs
// coffeeLogs.method uses the brewMethodEnum, not a foreign key

export const userRelations = relations(user, ({ many }) => ({
  logs: many(coffeeLogs),
  grinders: many(grinders),
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const coffeeLogsRelations = relations(coffeeLogs, ({ one }) => ({
  bean: one(coffeeBeans, {
    fields: [coffeeLogs.beanId],
    references: [coffeeBeans.id],
  }),
  grinder: one(grinders, {
    fields: [coffeeLogs.grinderId],
    references: [grinders.id],
  }),
  user: one(user, {
    fields: [coffeeLogs.userId],
    references: [user.id],
  }),
}));

// Type exports for use in your app
export type CoffeeBean = typeof coffeeBeans.$inferSelect;
export type NewCoffeeBean = typeof coffeeBeans.$inferInsert;
export type CoffeeLog = typeof coffeeLogs.$inferSelect;
export type NewCoffeeLog = typeof coffeeLogs.$inferInsert;
export type Grinder = typeof grinders.$inferSelect;
export type NewGrinder = typeof grinders.$inferInsert;
export type BrewMethod = typeof brewMethods.$inferSelect;
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;
