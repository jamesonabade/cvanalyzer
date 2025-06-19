import {
  users,
  cvAnalyses,
  cvFiles,
  type User,
  type UpsertUser,
  type CVAnalysis,
  type InsertCVAnalysis,
  type CVFile,
  type InsertCVFile,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // CV Analysis operations
  createCVAnalysis(analysis: InsertCVAnalysis): Promise<CVAnalysis>;
  getCVAnalysis(id: number): Promise<CVAnalysis | undefined>;
  getUserCVAnalyses(userId: string): Promise<CVAnalysis[]>;
  updateCVAnalysis(id: number, updates: Partial<InsertCVAnalysis>): Promise<CVAnalysis | undefined>;
  
  // CV File operations
  createCVFile(file: InsertCVFile): Promise<CVFile>;
  getCVFile(analysisId: number): Promise<CVFile | undefined>;
  
  // Dashboard operations
  getUserStats(userId: string): Promise<{
    totalAnalyses: number;
    averageScore: number;
    lastAnalysis: Date | null;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // CV Analysis operations
  async createCVAnalysis(analysis: InsertCVAnalysis): Promise<CVAnalysis> {
    const [cvAnalysis] = await db
      .insert(cvAnalyses)
      .values(analysis)
      .returning();
    return cvAnalysis;
  }

  async getCVAnalysis(id: number): Promise<CVAnalysis | undefined> {
    const [analysis] = await db
      .select()
      .from(cvAnalyses)
      .where(eq(cvAnalyses.id, id));
    return analysis;
  }

  async getUserCVAnalyses(userId: string): Promise<CVAnalysis[]> {
    return await db
      .select()
      .from(cvAnalyses)
      .where(eq(cvAnalyses.userId, userId))
      .orderBy(desc(cvAnalyses.createdAt));
  }

  async updateCVAnalysis(id: number, updates: Partial<InsertCVAnalysis>): Promise<CVAnalysis | undefined> {
    const [updated] = await db
      .update(cvAnalyses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(cvAnalyses.id, id))
      .returning();
    return updated;
  }

  // CV File operations
  async createCVFile(file: InsertCVFile): Promise<CVFile> {
    const [cvFile] = await db
      .insert(cvFiles)
      .values(file)
      .returning();
    return cvFile;
  }

  async getCVFile(analysisId: number): Promise<CVFile | undefined> {
    const [file] = await db
      .select()
      .from(cvFiles)
      .where(eq(cvFiles.analysisId, analysisId));
    return file;
  }

  // Dashboard operations
  async getUserStats(userId: string): Promise<{
    totalAnalyses: number;
    averageScore: number;
    lastAnalysis: Date | null;
  }> {
    const analyses = await this.getUserCVAnalyses(userId);
    
    const totalAnalyses = analyses.length;
    const averageScore = totalAnalyses > 0 
      ? analyses.reduce((sum, analysis) => sum + (parseFloat(analysis.overallScore || '0')), 0) / totalAnalyses
      : 0;
    const lastAnalysis = totalAnalyses > 0 ? analyses[0].createdAt : null;

    return {
      totalAnalyses,
      averageScore: Math.round(averageScore * 10) / 10,
      lastAnalysis,
    };
  }
}

export const storage = new DatabaseStorage();
