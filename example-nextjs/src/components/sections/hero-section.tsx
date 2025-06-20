import { motion } from 'framer-motion';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { HeroCursor } from '../cursors';
import { AnimatedParticles } from '../ui/animated-particles';
import { ScrollIndicator } from '../ui/scroll-indicator';
import { StatsBadges } from '../ui/stats-badges';
import { ANIMATION_DURATIONS } from '../../lib/constants';

interface HeroSectionProps {
  heroCursorMode: number;
}

function HeroSection({ heroCursorMode }: HeroSectionProps) {
  const statsBadges = ['< 10KB Bundle', '0 Dependencies', 'TypeScript Ready'];

  return (
    <div className="relative">
      <CustomCursor smoothness={2} className="z-50">
        <HeroCursor mode={heroCursorMode} />
      </CustomCursor>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatedParticles count={20} />

        <div className="container mx-auto px-6 py-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: ANIMATION_DURATIONS.hero / 1000 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Transform Your React App&apos;s
              </span>
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Cursor Into Anything
              </span>
            </h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Lightweight. Performant. Infinitely Customizable.
            </motion.p>

            <StatsBadges badges={statsBadges} delay={0.8} />

            {/* Primary CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
                Get Started in 2 Minutes
              </button>
              <button className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300">
                See Live Examples ↓
              </button>
            </motion.div>

            <ScrollIndicator />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export { HeroSection };
export type { HeroSectionProps }; 