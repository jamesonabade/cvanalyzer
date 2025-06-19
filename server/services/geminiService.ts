import { GoogleGenerativeAI } from '@google/generative-ai';

interface CVAnalysisResult {
  overallScore: number;
  experienceScore: number;
  educationScore: number;
  skillsScore: number;
  languagesScore: number;
  formatScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  isValidCV: boolean;
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '';
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY ou GOOGLE_AI_API_KEY deve estar configurada');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async validateCV(text: string): Promise<boolean> {
    const prompt = `
    Analise o texto abaixo e determine se é um currículo/CV válido.
    Responda apenas "SIM" se for um currículo válido ou "NÃO" se não for.
    
    Um currículo válido deve conter pelo menos:
    - Nome da pessoa
    - Informações de contato (email, telefone, etc.)
    - Experiência profissional OU educação/formação
    
    Texto para análise:
    ${text.substring(0, 2000)}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const answer = response.text().trim().toUpperCase();
      return answer.includes('SIM');
    } catch (error) {
      console.error('Erro na validação do CV:', error);
      return false;
    }
  }

  async analyzeCV(text: string): Promise<CVAnalysisResult> {
    const prompt = `
    Você é um especialista em análise de currículos. Analise o currículo em português brasileiro abaixo e forneça uma avaliação detalhada.

    IMPORTANTE: Responda EXATAMENTE no formato JSON especificado, sem texto adicional antes ou depois.

    Critérios de avaliação (nota de 0 a 10):
    1. Experiência Profissional (relevância, progressão, descrições)
    2. Formação Acadêmica (qualidade, relevância)
    3. Habilidades Técnicas (adequação, atualização, clareza)
    4. Idiomas (níveis, certificações)
    5. Formatação e Apresentação (clareza, organização, design)

    Forneça também:
    - Pontos fortes (máximo 5)
    - Pontos fracos (máximo 5)
    - Sugestões de melhoria (máximo 8)

    Formato de resposta (JSON válido):
    {
      "overallScore": 8.5,
      "experienceScore": 9.0,
      "educationScore": 8.0,
      "skillsScore": 7.5,
      "languagesScore": 9.0,
      "formatScore": 8.5,
      "strengths": [
        "Experiência sólida na área",
        "Formação acadêmica relevante"
      ],
      "weaknesses": [
        "Falta de certificações técnicas",
        "Descrições muito genéricas"
      ],
      "suggestions": [
        "Adicionar certificações em Python",
        "Detalhar melhor as conquistas"
      ],
      "isValidCV": true
    }

    Currículo para análise:
    ${text}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const jsonText = response.text().trim();
      
      // Tentar extrair JSON do texto
      let cleanJson = jsonText;
      if (jsonText.includes('```json')) {
        const match = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
        if (match) {
          cleanJson = match[1];
        }
      } else if (jsonText.includes('```')) {
        const match = jsonText.match(/```\s*([\s\S]*?)\s*```/);
        if (match) {
          cleanJson = match[1];
        }
      }

      const analysis = JSON.parse(cleanJson);
      
      // Validar e ajustar as pontuações
      const validatedAnalysis: CVAnalysisResult = {
        overallScore: Math.min(10, Math.max(0, analysis.overallScore || 0)),
        experienceScore: Math.min(10, Math.max(0, analysis.experienceScore || 0)),
        educationScore: Math.min(10, Math.max(0, analysis.educationScore || 0)),
        skillsScore: Math.min(10, Math.max(0, analysis.skillsScore || 0)),
        languagesScore: Math.min(10, Math.max(0, analysis.languagesScore || 0)),
        formatScore: Math.min(10, Math.max(0, analysis.formatScore || 0)),
        strengths: Array.isArray(analysis.strengths) ? analysis.strengths.slice(0, 5) : [],
        weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses.slice(0, 5) : [],
        suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions.slice(0, 8) : [],
        isValidCV: analysis.isValidCV !== false,
      };

      return validatedAnalysis;
    } catch (error) {
      console.error('Erro na análise do CV:', error);
      
      // Retornar análise padrão em caso de erro
      return {
        overallScore: 5.0,
        experienceScore: 5.0,
        educationScore: 5.0,
        skillsScore: 5.0,
        languagesScore: 5.0,
        formatScore: 5.0,
        strengths: ['Currículo estruturado'],
        weaknesses: ['Não foi possível analisar completamente'],
        suggestions: ['Tente enviar novamente o currículo'],
        isValidCV: true,
      };
    }
  }
}

export const geminiService = new GeminiService();
