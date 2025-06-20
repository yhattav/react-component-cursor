interface HeroCursorProps {
  mode: number;
}

function HeroCursor({ mode }: HeroCursorProps) {
  const modes = [
    <div key="glow" className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-70" />,
    <div key="particle" className="w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />,
    <div key="emoji" className="text-3xl">✨</div>,
    <div key="ring" className="w-6 h-6 border-2 border-purple-400 rounded-full bg-purple-400/20" />
  ];
  
  return modes[mode % modes.length];
}

export { HeroCursor };
export type { HeroCursorProps }; 