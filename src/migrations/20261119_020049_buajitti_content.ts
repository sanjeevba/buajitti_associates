import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_highlights_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_highlights_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_portfolio_projects_image_fit" AS ENUM('contain', 'cover');
  CREATE TYPE "public"."enum_portfolio_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__portfolio_projects_v_version_image_fit" AS ENUM('contain', 'cover');
  CREATE TYPE "public"."enum__portfolio_projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_team_members_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_members_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "home_highlights" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_home_highlights_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_home_highlights_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_icon" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__home_highlights_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "portfolio_projects_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "portfolio_projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"client" varchar,
  	"category" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_fit" "enum_portfolio_projects_image_fit" DEFAULT 'contain',
  	"project_date" varchar,
  	"project_u_r_l" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_portfolio_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_portfolio_projects_v_version_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_client" varchar,
  	"version_category" varchar,
  	"version_description" varchar,
  	"version_image_id" integer,
  	"version_image_fit" "enum__portfolio_projects_v_version_image_fit" DEFAULT 'contain',
  	"version_project_date" varchar,
  	"version_project_u_r_l" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__portfolio_projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"photo_id" integer,
  	"email" varchar,
  	"linkedin" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_team_members_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_team_members_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_role" varchar,
  	"version_bio" varchar,
  	"version_photo_id" integer,
  	"version_email" varchar,
  	"version_linkedin" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__team_members_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_about_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar DEFAULT 'Buajitti & Associates' NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_description" varchar NOT NULL,
  	"about_title" varchar NOT NULL,
  	"about_introduction" varchar NOT NULL,
  	"about_description" varchar,
  	"contact_address" varchar NOT NULL,
  	"contact_phone" varchar NOT NULL,
  	"contact_email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "home_highlights_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "portfolio_projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "team_members_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_submissions_id" integer;
  ALTER TABLE "_home_highlights_v" ADD CONSTRAINT "_home_highlights_v_parent_id_home_highlights_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_highlights"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects_technologies" ADD CONSTRAINT "portfolio_projects_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_version_technologies" ADD CONSTRAINT "_portfolio_projects_v_version_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v" ADD CONSTRAINT "_portfolio_projects_v_parent_id_portfolio_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v" ADD CONSTRAINT "_portfolio_projects_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_parent_id_team_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_about_benefits" ADD CONSTRAINT "site_settings_about_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_highlights_order_idx" ON "home_highlights" USING btree ("order");
  CREATE INDEX "home_highlights_updated_at_idx" ON "home_highlights" USING btree ("updated_at");
  CREATE INDEX "home_highlights_created_at_idx" ON "home_highlights" USING btree ("created_at");
  CREATE INDEX "home_highlights__status_idx" ON "home_highlights" USING btree ("_status");
  CREATE INDEX "_home_highlights_v_parent_idx" ON "_home_highlights_v" USING btree ("parent_id");
  CREATE INDEX "_home_highlights_v_version_version_order_idx" ON "_home_highlights_v" USING btree ("version_order");
  CREATE INDEX "_home_highlights_v_version_version_updated_at_idx" ON "_home_highlights_v" USING btree ("version_updated_at");
  CREATE INDEX "_home_highlights_v_version_version_created_at_idx" ON "_home_highlights_v" USING btree ("version_created_at");
  CREATE INDEX "_home_highlights_v_version_version__status_idx" ON "_home_highlights_v" USING btree ("version__status");
  CREATE INDEX "_home_highlights_v_created_at_idx" ON "_home_highlights_v" USING btree ("created_at");
  CREATE INDEX "_home_highlights_v_updated_at_idx" ON "_home_highlights_v" USING btree ("updated_at");
  CREATE INDEX "_home_highlights_v_latest_idx" ON "_home_highlights_v" USING btree ("latest");
  CREATE INDEX "portfolio_projects_technologies_order_idx" ON "portfolio_projects_technologies" USING btree ("_order");
  CREATE INDEX "portfolio_projects_technologies_parent_id_idx" ON "portfolio_projects_technologies" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "portfolio_projects_slug_idx" ON "portfolio_projects" USING btree ("slug");
  CREATE INDEX "portfolio_projects_image_idx" ON "portfolio_projects" USING btree ("image_id");
  CREATE INDEX "portfolio_projects_order_idx" ON "portfolio_projects" USING btree ("order");
  CREATE INDEX "portfolio_projects_updated_at_idx" ON "portfolio_projects" USING btree ("updated_at");
  CREATE INDEX "portfolio_projects_created_at_idx" ON "portfolio_projects" USING btree ("created_at");
  CREATE INDEX "portfolio_projects__status_idx" ON "portfolio_projects" USING btree ("_status");
  CREATE INDEX "_portfolio_projects_v_version_technologies_order_idx" ON "_portfolio_projects_v_version_technologies" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_version_technologies_parent_id_idx" ON "_portfolio_projects_v_version_technologies" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_parent_idx" ON "_portfolio_projects_v" USING btree ("parent_id");
  CREATE INDEX "_portfolio_projects_v_version_version_slug_idx" ON "_portfolio_projects_v" USING btree ("version_slug");
  CREATE INDEX "_portfolio_projects_v_version_version_image_idx" ON "_portfolio_projects_v" USING btree ("version_image_id");
  CREATE INDEX "_portfolio_projects_v_version_version_order_idx" ON "_portfolio_projects_v" USING btree ("version_order");
  CREATE INDEX "_portfolio_projects_v_version_version_updated_at_idx" ON "_portfolio_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_portfolio_projects_v_version_version_created_at_idx" ON "_portfolio_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_portfolio_projects_v_version_version__status_idx" ON "_portfolio_projects_v" USING btree ("version__status");
  CREATE INDEX "_portfolio_projects_v_created_at_idx" ON "_portfolio_projects_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_projects_v_updated_at_idx" ON "_portfolio_projects_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_projects_v_latest_idx" ON "_portfolio_projects_v" USING btree ("latest");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_order_idx" ON "team_members" USING btree ("order");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "team_members__status_idx" ON "team_members" USING btree ("_status");
  CREATE INDEX "_team_members_v_parent_idx" ON "_team_members_v" USING btree ("parent_id");
  CREATE INDEX "_team_members_v_version_version_photo_idx" ON "_team_members_v" USING btree ("version_photo_id");
  CREATE INDEX "_team_members_v_version_version_order_idx" ON "_team_members_v" USING btree ("version_order");
  CREATE INDEX "_team_members_v_version_version_updated_at_idx" ON "_team_members_v" USING btree ("version_updated_at");
  CREATE INDEX "_team_members_v_version_version_created_at_idx" ON "_team_members_v" USING btree ("version_created_at");
  CREATE INDEX "_team_members_v_version_version__status_idx" ON "_team_members_v" USING btree ("version__status");
  CREATE INDEX "_team_members_v_created_at_idx" ON "_team_members_v" USING btree ("created_at");
  CREATE INDEX "_team_members_v_updated_at_idx" ON "_team_members_v" USING btree ("updated_at");
  CREATE INDEX "_team_members_v_latest_idx" ON "_team_members_v" USING btree ("latest");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE INDEX "site_settings_about_benefits_order_idx" ON "site_settings_about_benefits" USING btree ("_order");
  CREATE INDEX "site_settings_about_benefits_parent_id_idx" ON "site_settings_about_benefits" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_home_highlights_fk" FOREIGN KEY ("home_highlights_id") REFERENCES "public"."home_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_projects_fk" FOREIGN KEY ("portfolio_projects_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_home_highlights_id_idx" ON "payload_locked_documents_rels" USING btree ("home_highlights_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolio_projects_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_highlights_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio_projects_technologies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio_projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_portfolio_projects_v_version_technologies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_portfolio_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_team_members_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_about_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_highlights" CASCADE;
  DROP TABLE "_home_highlights_v" CASCADE;
  DROP TABLE "portfolio_projects_technologies" CASCADE;
  DROP TABLE "portfolio_projects" CASCADE;
  DROP TABLE "_portfolio_projects_v_version_technologies" CASCADE;
  DROP TABLE "_portfolio_projects_v" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "_team_members_v" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "site_settings_about_benefits" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_home_highlights_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_portfolio_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_team_members_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_contact_submissions_fk";
  
  DROP INDEX "payload_locked_documents_rels_home_highlights_id_idx";
  DROP INDEX "payload_locked_documents_rels_portfolio_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_team_members_id_idx";
  DROP INDEX "payload_locked_documents_rels_contact_submissions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "home_highlights_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "portfolio_projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "team_members_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contact_submissions_id";
  DROP TYPE "public"."enum_home_highlights_status";
  DROP TYPE "public"."enum__home_highlights_v_version_status";
  DROP TYPE "public"."enum_portfolio_projects_image_fit";
  DROP TYPE "public"."enum_portfolio_projects_status";
  DROP TYPE "public"."enum__portfolio_projects_v_version_image_fit";
  DROP TYPE "public"."enum__portfolio_projects_v_version_status";
  DROP TYPE "public"."enum_team_members_status";
  DROP TYPE "public"."enum__team_members_v_version_status";`)
}
