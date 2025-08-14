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

/* --- Users --- */
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(), // keep text if you use NextAuth/Clerk-style IDs
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }),
    name: varchar("name", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    usersEmailUnique: uniqueIndex("users_email_key").on(t.email),
  }),
);

/* --- Coffee Beans --- */
export const coffeeBeans = pgTable(
  "coffee_beans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    roaster: varchar("roaster", { length: 255 }),
    origin: varchar("origin", { length: 255 }),
    roastLevel: roastLevelEnum("roast_level"),
    process: processEnum("process"),
    purchaseDate: date("purchase_date"),
    price: numeric("price", { precision: 10, scale: 2 }),
    weightGrams: integer("weight_grams"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    byUserName: index("coffee_beans_user_name_idx").on(t.userId, t.name),
    positivePrice: check(
      "coffee_beans_price_positive",
      sql`${t.price} is null or ${t.price} > 0`,
    ),
    positiveWeight: check(
      "coffee_beans_weight_positive",
      sql`${t.weightGrams} is null or ${t.weightGrams} > 0`,
    ),
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
      .references(() => users.id, { onDelete: "cascade" }),

    beanId: uuid("bean_id")
      .notNull()
      .references(() => coffeeBeans.id, { onDelete: "cascade" }),

    method: brewMethodEnum("method").notNull(),

    // single TZ-aware datetime; removed duplicate brewDate
    brewedAt: timestamp("brewed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    doseGrams: numeric("dose_grams", { precision: 5, scale: 2 }),
    yieldGrams: numeric("yield_grams", { precision: 5, scale: 2 }),
    brewTimeSeconds: integer("brew_time_seconds"),
    waterTempCelsius: integer("water_temp_celsius"),
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

// Note: brewMethods table is not directly referenced by coffeeLogs
// coffeeLogs.method uses the brewMethodEnum, not a foreign key

export const usersRelations = relations(users, ({ many }) => ({
  logs: many(coffeeLogs),
}));

export const coffeeLogsRelations = relations(coffeeLogs, ({ one }) => ({
  bean: one(coffeeBeans, {
    fields: [coffeeLogs.beanId],
    references: [coffeeBeans.id],
  }),
  user: one(users, {
    fields: [coffeeLogs.userId],
    references: [users.id],
  }),
}));

// Type exports for use in your app
export type CoffeeBean = typeof coffeeBeans.$inferSelect;
export type NewCoffeeBean = typeof coffeeBeans.$inferInsert;
export type CoffeeLog = typeof coffeeLogs.$inferSelect;
export type NewCoffeeLog = typeof coffeeLogs.$inferInsert;
export type BrewMethod = typeof brewMethods.$inferSelect;
export type User = typeof users.$inferSelect;
