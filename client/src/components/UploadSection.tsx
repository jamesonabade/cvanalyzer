import { useEffect, useRef } from 'react';

export default function UploadSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const reveals = entry.target.querySelectorAll('.scroll-reveal');
            reveals.forEach((reveal) => {
              reveal.classList.add('revealed');
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoginClick = () => {
    window.location.href = '/api/login';
  };

  return (
    <section id="upload-section" ref={sectionRef} className="section-bg-1 py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Experimente{' '}
              <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                Agora
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Faça login e envie seu currículo para receber uma análise completa
            </p>
          </div>
          
          {/* Upload Interface */}
          <div className="glass-dark rounded-3xl p-12 text-center hover-glow scroll-reveal">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
              <i className="fas fa-cloud-upload-alt text-white text-4xl"></i>
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-4">Experimente Agora</h3>
            <p className="text-gray-300 mb-8 text-lg">
              Faça login para arrastar seu currículo aqui ou clicar para selecionar
            </p>
            
            {/* Upload Area - Disabled */}
            <div className="border-2 border-dashed border-gray-500 rounded-2xl p-12 mb-8 opacity-60 cursor-not-allowed">
              <div>
                <i className="fas fa-file-pdf text-6xl text-gray-400 mb-4"></i>
                <p className="text-gray-400 text-lg mb-2">Suporte para PDF, DOC, DOCX • Máximo 10MB</p>
                <p className="text-sm text-gray-500">Login necessário para upload</p>
              </div>
            </div>
            
            {/* Login Required Message */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-xl p-4 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <i className="fas fa-info-circle text-yellow-400"></i>
                <p className="text-yellow-400 font-medium">Login necessário para analisar currículos</p>
              </div>
            </div>
            
            <button 
              onClick={handleLoginClick}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full sm:w-auto"
            >
              <i className="fas fa-sign-in-alt mr-3"></i>
              Fazer Login para Continuar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
