import { motion } from 'framer-motion';
import { useMounted } from '../../hooks/use-mounted';
import { useWindowDimensions } from '../../hooks/use-window-dimensions';

interface AnimatedParticlesProps {
  count?: number;
}

function AnimatedParticles({ count = 20 }: AnimatedParticlesProps) {
  const isMounted = useMounted();
  const { width, height } = useWindowDimensions();

  if (!isMounted) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => {
        const initialX = Math.random() * width;
        const initialY = Math.random() * height;
        const targetX = Math.random() * width;
        const targetY = Math.random() * height;
        
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            initial={{ 
              x: initialX,
              y: initialY,
              opacity: 0 
            }}
            animate={{ 
              x: targetX,
              y: targetY,
              opacity: [0, 1, 0] 
            }}
            transition={{ 
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        );
      })}
    </div>
  );
}

export { AnimatedParticles };
export type { AnimatedParticlesProps }; 