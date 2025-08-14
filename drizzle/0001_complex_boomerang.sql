ALTER TABLE "coffee_beans" DROP CONSTRAINT "coffee_beans_price_positive";--> statement-breakpoint
ALTER TABLE "coffee_beans" DROP CONSTRAINT "coffee_beans_weight_positive";--> statement-breakpoint
ALTER TABLE "coffee_beans" ADD COLUMN "roast_date" date;--> statement-breakpoint
ALTER TABLE "coffee_beans" DROP COLUMN "purchase_date";--> statement-breakpoint
ALTER TABLE "coffee_beans" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "coffee_beans" DROP COLUMN "weight_grams";