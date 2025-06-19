import { useEffect, useRef } from 'react';

export default function FeaturesSection() {
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
              }, index * 100);
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

  const features = [
    {
      icon: 'fas fa-brain',
      title: 'Análise com IA Avançada',
      description: 'Tecnologia Google Gemini analisa estrutura, conteúdo e adequação do seu currículo ao mercado atual.',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: 'fas fa-chart-bar',
      title: 'Pontuação Detalhada',
      description: 'Receba notas específicas para cada seção: experiência, educação, habilidades e muito mais.',
      gradient: 'from-green-500 to-green-600',
    },
    {
      icon: 'fas fa-lightbulb',
      title: 'Sugestões Personalizadas',
      description: 'Recomendações específicas para melhorar cada aspecto e aumentar suas chances de contratação.',
      gradient: 'from-yellow-500 to-orange-600',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Segurança Total',
      description: 'Seus dados são criptografados e protegidos. Nunca compartilhamos suas informações pessoais.',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: 'fas fa-history',
      title: 'Histórico de Progresso',
      description: 'Acompanhe a evolução do seu currículo ao longo do tempo com métricas detalhadas.',
      gradient: 'from-pink-500 to-pink-600',
    },
    {
      icon: 'fas fa-download',
      title: 'Relatórios Exportáveis',
      description: 'Baixe relatórios completos em PDF para referência futura e compartilhamento.',
      gradient: 'from-teal-500 to-teal-600',
    },
  ];

  return (
    <section id="recursos" ref={sectionRef} className="section-bg-2 py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Recursos{' '}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Avançados
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Nossa inteligência artificial analisa cada aspecto do seu currículo com precisão cirúrgica
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-dark rounded-3xl p-8 hover-glow scroll-reveal group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${feature.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
