import { motion } from 'framer-motion';

interface StatsBadgesProps {
  badges: string[];
  delay?: number;
}

function StatsBadges({ badges, delay = 0.8 }: StatsBadgesProps) {
  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-6 mb-12 text-sm font-semibold"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
    >
      {badges.map((badge, index) => (
        <span 
          key={index}
          className="bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700"
        >
          {badge}
        </span>
      ))}
    </motion.div>
  );
}

export { StatsBadges };
export type { StatsBadgesProps }; 