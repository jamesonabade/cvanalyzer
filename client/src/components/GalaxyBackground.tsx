import { useEffect, useState } from 'react';

interface Star {
  id: number;
  top: string;
  left: string;
  size: string;
  delay: string;
}

interface Comet {
  id: number;
  top: string;
  delay: string;
}

export default function GalaxyBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [comets, setComets] = useState<Comet[]>([]);

  useEffect(() => {
    // Generate stars
    const newStars: Star[] = [];
    for (let i = 0; i < 50; i++) {
      newStars.push({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 1}px`,
        delay: `${Math.random() * 2}s`,
      });
    }
    setStars(newStars);

    // Generate comets (fewer for cleaner look)
    const newComets: Comet[] = [];
    for (let i = 0; i < 3; i++) {
      newComets.push({
        id: i,
        top: `${Math.random() * 100}%`,
        delay: `${i * 4}s`,
      });
    }
    setComets(newComets);
  }, []);

  return (
    <>
      {/* Galaxy Background */}
      <div className="galaxy-bg">
        {/* Animated Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
            }}
          />
        ))}
        
        {/* Animated Comets */}
        {comets.map((comet) => (
          <div
            key={comet.id}
            className="comet"
            style={{
              top: comet.top,
              animationDelay: comet.delay,
            }}
          />
        ))}
      </div>

      {/* Floating Icons */}
      <div className="floating-icon" style={{ top: '15%', right: '10%', animationDelay: '0s' }}>
        <i className="fas fa-brain text-blue-400 text-xl"></i>
      </div>
      <div className="floating-icon" style={{ top: '25%', left: '8%', animationDelay: '2s' }}>
        <i className="fas fa-file-alt text-green-400 text-xl"></i>
      </div>
      <div className="floating-icon" style={{ top: '65%', right: '15%', animationDelay: '4s' }}>
        <i className="fas fa-chart-line text-yellow-400 text-xl"></i>
      </div>
      <div className="floating-icon" style={{ bottom: '20%', left: '12%', animationDelay: '6s' }}>
        <i className="fas fa-shield-alt text-blue-400 text-xl"></i>
      </div>
    </>
  );
}
