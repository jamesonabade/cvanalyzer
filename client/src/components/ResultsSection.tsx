import { useEffect, useRef } from 'react';

export default function ResultsSection() {
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
              }, index * 150);
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

  const testimonials = [
    {
      name: 'Carlos Mendes',
      role: 'Engenheiro de Software',
      comment: 'Consegui aumentar minha taxa de resposta em 300% depois de aplicar as sugestões da IA. Incrível!',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Maria Santos',
      role: 'Designer UX/UI',
      comment: 'As sugestões foram precisas e me ajudaram a destacar pontos que eu nem sabia que eram importantes.',
      gradient: 'from-green-500 to-green-600',
    },
    {
      name: 'Pedro Lima',
      role: 'Analista de Dados',
      comment: 'Finalmente consegui a vaga dos sonhos depois de otimizar meu CV com as recomendações da IA.',
      gradient: 'from-yellow-500 to-orange-600',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Currículos Analisados', color: 'text-blue-400' },
    { value: '89%', label: 'Taxa de Melhoria', color: 'text-green-400' },
    { value: '2.3x', label: 'Mais Entrevistas', color: 'text-yellow-400' },
    { value: '4.9/5', label: 'Avaliação dos Usuários', color: 'text-purple-400' },
  ];

  return (
    <section id="resultados" ref={sectionRef} className="section-bg-2 py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Resultados{' '}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Comprovados
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Veja como nossa IA ajudou profissionais a conseguirem melhores oportunidades
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass-dark rounded-3xl p-8 hover-glow scroll-reveal">
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center mr-4`}>
                  <i className="fas fa-user text-white"></i>
                </div>
                <div>
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">"{testimonial.comment}"</p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="scroll-reveal">
              <div className={`text-4xl font-black ${stat.color} mb-2`}>{stat.value}</div>
              <p className="text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
