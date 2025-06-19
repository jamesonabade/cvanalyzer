import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleUploadClick = () => {
    // Scroll to upload section
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDemoClick = () => {
    // Scroll to results section to show demo
    const resultsSection = document.getElementById('resultados');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section-bg-1 min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-green-500/20 text-blue-400 text-sm font-medium border border-blue-500/30">
                <i className="fas fa-sparkles mr-2"></i>
                Powered by Google Gemini AI
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Análise Inteligente de{' '}
              <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                Currículos
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Transforme seu currículo com nossa IA avançada. Receba feedback detalhado, 
              sugestões personalizadas e maximize suas chances de sucesso profissional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={handleUploadClick}
                className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center"
              >
                <i className="fas fa-upload mr-3 group-hover:animate-bounce"></i>
                Analisar Meu Currículo
              </button>
              <button 
                onClick={handleDemoClick}
                className="glass-dark hover-glow text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center"
              >
                <i className="fas fa-play mr-3"></i>
                Ver Demo
              </button>
            </div>
            
            <div className="flex flex-wrap gap-8 text-sm">
              <div className="flex items-center text-green-400">
                <i className="fas fa-check-circle mr-2"></i>
                <span>100% Gratuito para começar</span>
              </div>
              <div className="flex items-center text-green-400">
                <i className="fas fa-lock mr-2"></i>
                <span>Dados seguros e privados</span>
              </div>
              <div className="flex items-center text-yellow-400">
                <i className="fas fa-bolt mr-2"></i>
                <span>Resultados em segundos</span>
              </div>
            </div>
          </div>
          
          {/* Right Content - CV Example */}
          <div className={`lg:pl-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="cv-example rounded-3xl p-8 shadow-2xl hover-glow relative overflow-hidden">
              {/* CV Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-gray-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Ana Silva</h3>
                    <p className="text-gray-600">Desenvolvedora Full Stack</p>
                    <p className="text-sm text-gray-500">São Paulo, SP • ana.silva@email.com</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">8.5/10</div>
                  <p className="text-sm text-gray-600">Pontuação Geral</p>
                </div>
              </div>
              
              {/* CV Sections with Scores */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Experiência Profissional</p>
                      <p className="text-sm text-gray-600">5 anos • Tecnologia</p>
                    </div>
                  </div>
                  <div className="text-green-500 font-bold">9.2/10</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Formação Acadêmica</p>
                      <p className="text-sm text-gray-600">Ciência da Computação • USP</p>
                    </div>
                  </div>
                  <div className="text-green-500 font-bold">8.8/10</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <i className="fas fa-exclamation text-white text-sm"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Habilidades Técnicas</p>
                      <p className="text-sm text-gray-600">Melhore suas habilidades em Python</p>
                    </div>
                  </div>
                  <div className="text-yellow-500 font-bold">7.5/10</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Idiomas</p>
                      <p className="text-sm text-gray-600">Português, Inglês Avançado</p>
                    </div>
                  </div>
                  <div className="text-green-500 font-bold">9.0/10</div>
                </div>
              </div>
              
              {/* AI Suggestion Popup */}
              <div className="absolute -top-2 -right-2 glass-dark rounded-xl p-3 border border-yellow-500/50 animate-pulse-glow">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-lightbulb text-yellow-400"></i>
                  <p className="text-xs text-white">Sugestão de Melhoria</p>
                </div>
                <p className="text-xs text-gray-300 mt-1">Adicione certificações em Python</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
