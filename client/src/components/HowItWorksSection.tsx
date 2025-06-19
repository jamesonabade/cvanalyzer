import { useEffect, useRef } from 'react';

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const reveals = entry.target.querySelectorAll('.scroll-reveal');
            reveals.forEach((reveal, index) => {
              setTimeout(() => {
                reveal.classList.add('revealed');
              }, index * 200);
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

  const handleStartClick = () => {
    window.location.href = '/api/login';
  };

  const steps = [
    {
      number: 1,
      icon: 'fas fa-user-plus',
      title: 'Crie sua Conta',
      description: 'Cadastre-se gratuitamente em nossa plataforma segura. Processo rápido e sem complicações.',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      number: 2,
      icon: 'fas fa-cloud-upload-alt',
      title: 'Envie seu Currículo',
      description: 'Faça upload do seu CV em PDF, DOC ou DOCX. Nossa IA valida automaticamente o documento.',
      gradient: 'from-green-500 to-green-600',
    },
    {
      number: 3,
      icon: 'fas fa-magic',
      title: 'Receba a Análise',
      description: 'Em segundos, receba feedback detalhado com pontuação, pontos fortes e sugestões de melhoria.',
      gradient: 'from-yellow-500 to-orange-600',
    },
  ];

  return (
    <section id="como-funciona" ref={sectionRef} className="section-bg-3 py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Como{' '}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Funciona
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Processo simples e rápido para transformar seu currículo em uma ferramenta poderosa
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transform -translate-y-1/2"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="text-center scroll-reveal group">
              <div className="relative mb-8">
                <div className={`w-24 h-24 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                  <i className={`${step.icon} text-white text-3xl`}></i>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.number}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-gray-300 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <div className="text-center mt-16 scroll-reveal">
          <button 
            onClick={handleStartClick}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-green-500 hover:to-blue-500 text-white px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Começar Agora - É Grátis!
          </button>
        </div>
      </div>
    </section>
  );
}
