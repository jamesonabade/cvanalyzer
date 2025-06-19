import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';
import GalaxyBackground from '@/components/GalaxyBackground';
import Navigation from '@/components/Navigation';
import CVAnalysisResult from '@/components/CVAnalysisResult';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CVAnalysis } from '@shared/schema';

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<CVAnalysis | null>(null);

  // Fetch user stats
  const { data: stats } = useQuery({
    queryKey: ['/api/user/stats'],
    retry: false,
  });

  // Fetch user's CV analyses
  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ['/api/cv/analyses'],
    retry: false,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('cv', file);
      return await apiRequest('POST', '/api/cv/upload', formData);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['/api/cv/analyses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/stats'] });
      toast({
        title: 'Sucesso!',
        description: 'Seu currículo foi analisado com sucesso.',
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: 'Não autorizado',
          description: 'Fazendo login novamente...',
          variant: 'destructive',
        });
        setTimeout(() => {
          window.location.href = '/api/login';
        }, 500);
        return;
      }
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao processar o currículo.',
        variant: 'destructive',
      });
    },
  });

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Tipo de arquivo não suportado',
        description: 'Use apenas PDF, DOC ou DOCX.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O arquivo deve ter no máximo 10MB.',
        variant: 'destructive',
      });
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  if (selectedAnalysis) {
    return (
      <div className="relative min-h-screen">
        <GalaxyBackground />
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-6">
            <div className="mb-6">
              <Button
                onClick={() => setSelectedAnalysis(null)}
                variant="outline"
                className="text-white border-gray-600 hover:bg-gray-700"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Voltar
              </Button>
            </div>
            <CVAnalysisResult analysis={selectedAnalysis} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <GalaxyBackground />
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          {/* Welcome Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">
              Bem-vindo, {user?.firstName || user?.email?.split('@')[0] || 'Usuário'}!
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Envie seu currículo e receba uma análise detalhada com sugestões personalizadas
            </p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="glass-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <i className="fas fa-file-alt text-blue-500 mr-2"></i>
                    Total de Análises
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">{stats.totalAnalyses}</div>
                </CardContent>
              </Card>

              <Card className="glass-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <i className="fas fa-chart-line text-green-500 mr-2"></i>
                    Pontuação Média
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">{stats.averageScore.toFixed(1)}/10</div>
                </CardContent>
              </Card>

              <Card className="glass-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <i className="fas fa-clock text-yellow-500 mr-2"></i>
                    Última Análise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg text-yellow-400">
                    {stats.lastAnalysis 
                      ? new Date(stats.lastAnalysis).toLocaleDateString('pt-BR')
                      : 'Nenhuma'
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Upload Section */}
          <Card className="glass-dark border-gray-700 mb-12">
            <CardHeader>
              <CardTitle className="text-white text-center text-2xl">
                <i className="fas fa-cloud-upload-alt mr-2"></i>
                Analisar Novo Currículo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-gray-500 hover:border-blue-500'
                } ${uploadMutation.isPending ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadMutation.isPending ? (
                  <div className="space-y-4">
                    <div className="spinner mx-auto"></div>
                    <p className="text-gray-300">Analisando seu currículo...</p>
                    <Progress value={50} className="max-w-md mx-auto" />
                  </div>
                ) : (
                  <>
                    <i className="fas fa-file-pdf text-6xl text-gray-400 mb-4"></i>
                    <p className="text-gray-300 text-lg mb-2">
                      Arraste seu currículo aqui ou clique para selecionar
                    </p>
                    <p className="text-sm text-gray-500">
                      Suporte para PDF, DOC, DOCX • Máximo 10MB
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Analyses History */}
          <Card className="glass-dark border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                <i className="fas fa-history mr-2"></i>
                Histórico de Análises
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysesLoading ? (
                <div className="text-center py-8">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-gray-300">Carregando análises...</p>
                </div>
              ) : analyses && analyses.length > 0 ? (
                <div className="space-y-4">
                  {analyses.map((analysis: CVAnalysis) => (
                    <div
                      key={analysis.id}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedAnalysis(analysis)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <i className="fas fa-file-alt text-white"></i>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{analysis.fileName}</h4>
                          <p className="text-gray-400 text-sm">
                            {new Date(analysis.createdAt!).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-400">
                          {parseFloat(analysis.overallScore || '0').toFixed(1)}/10
                        </div>
                        <i className="fas fa-chevron-right text-gray-400"></i>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-file-alt text-6xl text-gray-600 mb-4"></i>
                  <p className="text-gray-400">Nenhuma análise encontrada</p>
                  <p className="text-gray-500 text-sm">Envie seu primeiro currículo para começar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
