
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface FlippableCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
  cardClassName?: string;
  autoRotate?: boolean;
  rotationInterval?: number;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const FlippableCard: React.FC<FlippableCardProps> = ({
  frontContent,
  backContent,
  className,
  cardClassName,
  autoRotate = false,
  rotationInterval = 3000,
  hoverEffect = true,
  onClick
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (onClick) onClick();
  };

  // Auto rotation effect
  useEffect(() => {
    if (autoRotate) {
      intervalRef.current = setInterval(() => {
        setIsFlipped(prev => !prev);
      }, rotationInterval);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRotate, rotationInterval]);
  
  // Mouse move effect for 3D tilting
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !hoverEffect) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `${isFlipped ? 'rotateY(180deg)' : ''} rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    const handleMouseLeave = () => {
      card.style.transform = isFlipped ? 'rotateY(180deg)' : '';
      card.style.transition = 'transform 0.5s ease';
    };
    
    const handleMouseEnter = () => {
      card.style.transition = 'transform 0.1s ease';
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
        card.removeEventListener('mouseenter', handleMouseEnter);
      }
    };
  }, [isFlipped, hoverEffect]);

  return (
    <div 
      className={cn(
        "perspective-1000 cursor-pointer",
        className
      )}
      onClick={handleFlip}
    >
      <div
        ref={cardRef}
        className={cn(
          "relative w-full h-full transition-transform duration-700 transform-style-3d shadow-lg",
          isFlipped ? "rotate-y-180" : "",
          cardClassName
        )}
      >
        {/* Front side */}
        <div 
          className={cn(
            "absolute w-full h-full rounded-lg backface-hidden overflow-hidden",
            isFlipped ? "z-0 pointer-events-none" : "z-10"
          )}
        >
          {frontContent}
        </div>
        
        {/* Back side */}
        <div 
          className={cn(
            "absolute w-full h-full rounded-lg backface-hidden rotate-y-180 overflow-hidden",
            isFlipped ? "z-10" : "z-0 pointer-events-none"
          )}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default FlippableCard;
