function ParticleCursor() {
  return (
    <div className="relative pointer-events-none">
      <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
      <div className="absolute -top-1 -left-1 w-4 h-4 border border-cyan-400 rounded-full animate-pulse" />
    </div>
  );
}

export { ParticleCursor }; 