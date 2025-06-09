import { motion } from 'framer-motion';

function ScrollIndicator() {
  return (
    <motion.div 
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
    >
      <motion.div
        className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center cursor-pointer"
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          className="w-1 h-2 bg-gray-400 rounded-full mt-2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}

export { ScrollIndicator }; 