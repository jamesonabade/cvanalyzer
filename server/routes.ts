import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from 'multer';
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { geminiService } from "./services/geminiService";
import { uploadCVSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Use PDF, DOC ou DOCX.'));
    }
  }
});

async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  // Simple text extraction - in production, use proper libraries like pdf-parse, mammoth
  try {
    if (mimeType === 'application/pdf') {
      // For PDF files - would need pdf-parse library
      return buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r]/g, '');
    } else if (mimeType.includes('word')) {
      // For Word files - would need mammoth library
      return buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r]/g, '');
    }
    return buffer.toString('utf-8');
  } catch (error) {
    throw new Error('Erro ao extrair texto do arquivo');
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Upload and analyze CV
  app.post('/api/cv/upload', isAuthenticated, upload.single('cv'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo foi enviado' });
      }

      const userId = req.user.claims.sub;
      const file = req.file;

      // Extract text from file
      const extractedText = await extractTextFromFile(file.buffer, file.mimetype);
      
      if (!extractedText || extractedText.trim().length < 100) {
        return res.status(400).json({ 
          message: 'Não foi possível extrair texto suficiente do arquivo. Verifique se o arquivo não está corrompido.' 
        });
      }

      // Validate if it's a CV
      const isValidCV = await geminiService.validateCV(extractedText);
      if (!isValidCV) {
        return res.status(400).json({ 
          message: 'O arquivo enviado não parece ser um currículo válido. Certifique-se de enviar um CV com suas informações profissionais.' 
        });
      }

      // Analyze CV with Gemini
      const analysis = await geminiService.analyzeCV(extractedText);

      // Create CV analysis record
      const cvAnalysis = await storage.createCVAnalysis({
        userId,
        fileName: file.originalname,
        fileSize: file.size,
        overallScore: analysis.overallScore.toString(),
        experienceScore: analysis.experienceScore.toString(),
        educationScore: analysis.educationScore.toString(),
        skillsScore: analysis.skillsScore.toString(),
        languagesScore: analysis.languagesScore.toString(),
        formatScore: analysis.formatScore.toString(),
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        suggestions: analysis.suggestions,
        analysisData: analysis,
        isValidCV: analysis.isValidCV,
      });

      // Store file data
      await storage.createCVFile({
        analysisId: cvAnalysis.id,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileContent: file.buffer.toString('base64'),
        extractedText,
      });

      res.json({
        success: true,
        analysis: cvAnalysis,
        message: 'CV analisado com sucesso!'
      });

    } catch (error) {
      console.error('Erro no upload/análise do CV:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Erro interno do servidor ao processar o CV' 
      });
    }
  });

  // Get user's CV analyses
  app.get('/api/cv/analyses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const analyses = await storage.getUserCVAnalyses(userId);
      res.json(analyses);
    } catch (error) {
      console.error('Erro ao buscar análises:', error);
      res.status(500).json({ message: 'Erro ao buscar análises do usuário' });
    }
  });

  // Get specific CV analysis
  app.get('/api/cv/analysis/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const analysisId = parseInt(req.params.id);
      
      const analysis = await storage.getCVAnalysis(analysisId);
      if (!analysis || analysis.userId !== userId) {
        return res.status(404).json({ message: 'Análise não encontrada' });
      }

      res.json(analysis);
    } catch (error) {
      console.error('Erro ao buscar análise:', error);
      res.status(500).json({ message: 'Erro ao buscar análise' });
    }
  });

  // Get user dashboard stats
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ message: 'Erro ao buscar estatísticas do usuário' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
