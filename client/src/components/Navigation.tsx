import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface NavigationProps {
  isLanding?: boolean;
}

export default function Navigation({ isLanding = false }: NavigationProps) {
  const { isAuthenticated, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className={`glass-effect fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[rgba(26,31,58,0.95)]' : 'bg-[rgba(255,255,255,0.1)]'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <i className="fas fa-brain text-white text-lg"></i>
            </div>
            <span className="text-2xl font-bold text-white">CVAnalyzer</span>
          </div>
          
          {/* Navigation Links - Only show on landing page */}
          {isLanding && (
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('recursos')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Recursos
              </button>
              <button 
                onClick={() => scrollToSection('como-funciona')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Como Funciona
              </button>
              <button 
                onClick={() => scrollToSection('resultados')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Resultados
              </button>
            </div>
          )}
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={handleLogin}
                  className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  Entrar
                </button>
                <button 
                  onClick={handleLogin}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Cadastrar
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2 text-gray-300">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <i className="fas fa-user text-white text-sm"></i>
                    )}
                  </div>
                  <span className="hidden sm:inline">
                    {user?.firstName || user?.email?.split('@')[0] || 'Usuário'}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  Sair
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
