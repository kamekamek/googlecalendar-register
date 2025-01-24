import { useEffect, useState } from 'react';

const BackgroundGradient = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 transition-all duration-500 ease-in-out"
        style={{
          transform: `translate(${mousePosition.x / 10}px, ${mousePosition.y / 10}px)`,
          filter: 'blur(150px)',
        }}
      />
      <div className="absolute inset-0 bg-[#030014]/50" />
    </div>
  );
};

export default BackgroundGradient; 