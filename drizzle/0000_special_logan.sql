CREATE TYPE "public"."brew_method" AS ENUM('espresso', 'v60', 'aeropress', 'french_press', 'moka', 'chemex', 'turkish', 'cold_brew');--> statement-breakpoint
CREATE TYPE "public"."process" AS ENUM('washed', 'natural', 'honey', 'anaerobic');--> statement-breakpoint
CREATE TYPE "public"."roast_level" AS ENUM('light', 'medium', 'medium-dark', 'dark');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brew_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" "brew_method" NOT NULL,
	"default_temp" integer,
	"default_time" integer,
	"default_ratio" varchar(10),
	"grind_size" varchar(50),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "coffee_beans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"roaster" varchar(255),
	"origin" varchar(255),
	"roast_level" "roast_level",
	"process" "process",
	"roast_date" date,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coffee_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"bean_id" uuid NOT NULL,
	"method" "brew_method" NOT NULL,
	"brewed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"dose_grams" numeric(5, 2),
	"yield_grams" numeric(5, 2),
	"brew_time_seconds" integer,
	"water_temp_celsius" integer,
	"grind_setting" varchar(50),
	"rating" integer,
	"notes" text,
	"flavor_notes" text,
	"photo_url" varchar(500),
	"is_public" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coffee_logs_rating_range" CHECK ("coffee_logs"."rating" is null or ("coffee_logs"."rating" >= 1 and "coffee_logs"."rating" <= 5)),
	CONSTRAINT "coffee_logs_dose_positive" CHECK ("coffee_logs"."dose_grams" is null or "coffee_logs"."dose_grams" > 0),
	CONSTRAINT "coffee_logs_yield_positive" CHECK ("coffee_logs"."yield_grams" is null or "coffee_logs"."yield_grams" > 0)
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coffee_beans" ADD CONSTRAINT "coffee_beans_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coffee_logs" ADD CONSTRAINT "coffee_logs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coffee_logs" ADD CONSTRAINT "coffee_logs_bean_id_coffee_beans_id_fk" FOREIGN KEY ("bean_id") REFERENCES "public"."coffee_beans"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "brew_methods_name_key" ON "brew_methods" USING btree ("name");--> statement-breakpoint
CREATE INDEX "coffee_beans_user_name_idx" ON "coffee_beans" USING btree ("user_id","name");--> statement-breakpoint
CREATE INDEX "coffee_logs_user_idx" ON "coffee_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "coffee_logs_bean_idx" ON "coffee_logs" USING btree ("bean_id");--> statement-breakpoint
CREATE INDEX "coffee_logs_method_idx" ON "coffee_logs" USING btree ("method");--> statement-breakpoint
CREATE INDEX "coffee_logs_brewed_at_idx" ON "coffee_logs" USING btree ("brewed_at");--> statement-breakpoint
CREATE INDEX "coffee_logs_user_brewed_at_idx" ON "coffee_logs" USING btree ("user_id","brewed_at");--> statement-breakpoint
CREATE INDEX "coffee_logs_user_method_idx" ON "coffee_logs" USING btree ("user_id","method");--> statement-breakpoint
CREATE INDEX "coffee_logs_active_idx" ON "coffee_logs" USING btree ("user_id","brewed_at") WHERE "coffee_logs"."deleted_at" is null;