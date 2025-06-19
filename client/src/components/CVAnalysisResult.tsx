import { useState } from 'react';
import { CVAnalysis } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface CVAnalysisResultProps {
  analysis: CVAnalysis;
}

export default function CVAnalysisResult({ analysis }: CVAnalysisResultProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'suggestions'>('overview');

  const overallScore = parseFloat(analysis.overallScore || '0');
  const experienceScore = parseFloat(analysis.experienceScore || '0');
  const educationScore = parseFloat(analysis.educationScore || '0');
  const skillsScore = parseFloat(analysis.skillsScore || '0');
  const languagesScore = parseFloat(analysis.languagesScore || '0');
  const formatScore = parseFloat(analysis.formatScore || '0');

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="glass-dark border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-white">{analysis.fileName}</CardTitle>
              <p className="text-gray-400">
                Analisado em {new Date(analysis.createdAt!).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore.toFixed(1)}/10
              </div>
              <p className="text-gray-400">Pontuação Geral</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Visão Geral' },
          { id: 'details', label: 'Detalhes' },
          { id: 'suggestions', label: 'Sugestões' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Scores */}
          <Card className="glass-dark border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Pontuações por Seção</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Experiência', score: experienceScore },
                { label: 'Educação', score: educationScore },
                { label: 'Habilidades', score: skillsScore },
                { label: 'Idiomas', score: languagesScore },
                { label: 'Formatação', score: formatScore },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">{item.label}</span>
                    <span className={`font-bold ${getScoreColor(item.score)}`}>
                      {item.score.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress 
                    value={item.score * 10} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Strengths & Weaknesses */}
          <div className="space-y-6">
            {/* Strengths */}
            <Card className="glass-dark border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>
                  Pontos Fortes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.strengths?.map((strength, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/50">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card className="glass-dark border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <i className="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                  Pontos a Melhorar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.weaknesses?.map((weakness, index) => (
                    <Badge key={index} variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                      {weakness}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'suggestions' && (
        <Card className="glass-dark border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <i className="fas fa-lightbulb text-blue-500 mr-2"></i>
              Sugestões de Melhoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.suggestions?.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-300">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'details' && (
        <Card className="glass-dark border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Detalhes da Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Informações do Arquivo</h4>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Nome:</strong> {analysis.fileName}</p>
                  <p><strong>Tamanho:</strong> {(analysis.fileSize / 1024).toFixed(2)} KB</p>
                  <p><strong>Válido:</strong> {analysis.isValidCV ? 'Sim' : 'Não'}</p>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Estatísticas</h4>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Pontos Fortes:</strong> {analysis.strengths?.length || 0}</p>
                  <p><strong>Pontos Fracos:</strong> {analysis.weaknesses?.length || 0}</p>
                  <p><strong>Sugestões:</strong> {analysis.suggestions?.length || 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
