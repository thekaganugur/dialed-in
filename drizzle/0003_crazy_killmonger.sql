ALTER TABLE "grinders" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "grinders" DROP COLUMN "is_built_in";