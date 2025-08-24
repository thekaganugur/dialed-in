CREATE TABLE "grinders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"display_name" varchar(100) NOT NULL,
	"brand" varchar(50),
	"model" varchar(50),
	"notes" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_built_in" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coffee_logs" ADD COLUMN "grinder_id" uuid;--> statement-breakpoint
ALTER TABLE "grinders" ADD CONSTRAINT "grinders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "grinders_user_active_idx" ON "grinders" USING btree ("user_id","is_active") WHERE "grinders"."is_active" = true;--> statement-breakpoint
CREATE INDEX "grinders_display_name_idx" ON "grinders" USING btree ("display_name");--> statement-breakpoint
ALTER TABLE "coffee_logs" ADD CONSTRAINT "coffee_logs_grinder_id_grinders_id_fk" FOREIGN KEY ("grinder_id") REFERENCES "public"."grinders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint

-- Built-in grinder seed data
INSERT INTO "grinders" ("id", "user_id", "display_name", "brand", "model", "is_built_in", "created_at") VALUES
('550e8400-e29b-41d4-a716-446655440001', NULL, 'Comandante C40', 'Comandante', 'C40', true, NOW()),
('550e8400-e29b-41d4-a716-446655440002', NULL, 'Baratza Encore', 'Baratza', 'Encore', true, NOW()),
('550e8400-e29b-41d4-a716-446655440003', NULL, 'Baratza Virtuoso', 'Baratza', 'Virtuoso', true, NOW()),
('550e8400-e29b-41d4-a716-446655440004', NULL, 'Fellow Ode Gen 2', 'Fellow', 'Ode Gen 2', true, NOW()),
('550e8400-e29b-41d4-a716-446655440005', NULL, 'Hario Mini Mill', 'Hario', 'Mini Mill', true, NOW()),
('550e8400-e29b-41d4-a716-446655440006', NULL, '1Zpresso JX-Pro', '1Zpresso', 'JX-Pro', true, NOW()),
('550e8400-e29b-41d4-a716-446655440007', NULL, 'Timemore C2', 'Timemore', 'C2', true, NOW()),
('550e8400-e29b-41d4-a716-446655440008', NULL, 'Eureka Mignon Silenzio', 'Eureka', 'Mignon Silenzio', true, NOW());