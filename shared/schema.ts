import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CV Analysis table
export const cvAnalyses = pgTable("cv_analyses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  fileName: varchar("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  overallScore: decimal("overall_score", { precision: 3, scale: 1 }),
  experienceScore: decimal("experience_score", { precision: 3, scale: 1 }),
  educationScore: decimal("education_score", { precision: 3, scale: 1 }),
  skillsScore: decimal("skills_score", { precision: 3, scale: 1 }),
  languagesScore: decimal("languages_score", { precision: 3, scale: 1 }),
  formatScore: decimal("format_score", { precision: 3, scale: 1 }),
  strengths: text("strengths").array(),
  weaknesses: text("weaknesses").array(),
  suggestions: text("suggestions").array(),
  analysisData: jsonb("analysis_data"), // Raw analysis from Gemini
  isValidCV: boolean("is_valid_cv").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CV Files table for storing file metadata
export const cvFiles = pgTable("cv_files", {
  id: serial("id").primaryKey(),
  analysisId: integer("analysis_id").references(() => cvAnalyses.id).notNull(),
  originalName: varchar("original_name").notNull(),
  mimeType: varchar("mime_type").notNull(),
  fileContent: text("file_content"), // Base64 encoded content
  extractedText: text("extracted_text"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertCVAnalysis = typeof cvAnalyses.$inferInsert;
export type CVAnalysis = typeof cvAnalyses.$inferSelect;

export type InsertCVFile = typeof cvFiles.$inferInsert;
export type CVFile = typeof cvFiles.$inferSelect;

// Zod schemas
export const insertCVAnalysisSchema = createInsertSchema(cvAnalyses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const uploadCVSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().positive(),
  fileContent: z.string().min(1),
  mimeType: z.string().min(1),
});

export type UploadCVData = z.infer<typeof uploadCVSchema>;
