import React, { useState } from 'react';
import { AnimatedBorder } from '@yhattav/react-component-cursor';

interface AnimatedBorderSectionProps {
  onDebugData?: (data: Record<string, unknown>) => void;
}

export const AnimatedBorderSection: React.FC<AnimatedBorderSectionProps> = ({ onDebugData }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(3000);
  const [lightSize, setLightSize] = useState(100);

  // Update debug data
  React.useEffect(() => {
    onDebugData?.({
      isPaused,
      duration,
      lightSize,
    });
  }, [isPaused, duration, lightSize, onDebugData]);

  return (
    <div className="min-h-screen bg-neutral-900 p-8 overflow-y-auto">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">AnimatedBorder Component</h1>
        <p className="text-neutral-400 text-lg">
          A versatile component that wraps any element and adds an animated light effect 
          traveling around its perimeter. Perfect for attention-grabbing UI elements.
        </p>
      </div>

      {/* Controls */}
      <div className="max-w-6xl mx-auto mb-12 p-6 bg-neutral-800 rounded-xl">
        <h2 className="text-xl font-semibold text-white mb-4">Global Controls</h2>
        <div className="flex flex-wrap gap-6 items-center">
          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={isPaused}
              onChange={(e) => setIsPaused(e.target.checked)}
              className="w-5 h-5 rounded"
            />
            Paused
          </label>
          <label className="flex flex-col gap-1 text-white">
            <span className="text-sm text-neutral-400">Duration: {duration}ms</span>
            <input
              type="range"
              min="500"
              max="10000"
              step="100"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-40"
            />
          </label>
          <label className="flex flex-col gap-1 text-white">
            <span className="text-sm text-neutral-400">Light Size: {lightSize}px</span>
            <input
              type="range"
              min="20"
              max="300"
              step="10"
              value={lightSize}
              onChange={(e) => setLightSize(Number(e.target.value))}
              className="w-40"
            />
          </label>
        </div>
      </div>

      {/* Trigger Mode Comparison - NEW FEATURE */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Trigger Modes</h2>
        <p className="text-neutral-400 mb-8">
          Control when the animation effect is visible. Move your cursor to see the difference!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Always */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-400 uppercase tracking-wide text-sm">Always</span>
            <p className="text-neutral-500 text-xs text-center mb-2">Effect always visible</p>
            <AnimatedBorder
              trigger="always"
              mode="border"
              color="rgba(34, 197, 94, 1)"
              duration={duration}
              lightSize={80}
              paused={isPaused}
              debug
            >
              <div className="w-56 h-36 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="text-white font-medium">Always On</span>
              </div>
            </AnimatedBorder>
          </div>

          {/* Hover */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-400 uppercase tracking-wide text-sm">Hover</span>
            <p className="text-neutral-500 text-xs text-center mb-2">Effect only when cursor is inside</p>
            <AnimatedBorder
              trigger="hover"
              mode="border"
              color="rgba(59, 130, 246, 1)"
              duration={duration}
              lightSize={80}
              paused={isPaused}
              debug
            >
              <div className="w-56 h-36 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="text-white font-medium">Hover Me</span>
              </div>
            </AnimatedBorder>
          </div>

          {/* Proximity */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-400 uppercase tracking-wide text-sm">Proximity</span>
            <p className="text-neutral-500 text-xs text-center mb-2">Effect fades in as cursor approaches</p>
            <AnimatedBorder
              trigger="proximity"
              proximityRadius={150}
              mode="border"
              color="rgba(168, 85, 247, 1)"
              duration={duration}
              lightSize={80}
              paused={isPaused}
              debug
            >
              <div className="w-56 h-36 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="text-white font-medium">Come Closer</span>
              </div>
            </AnimatedBorder>
          </div>
        </div>
      </section>

      {/* Proximity Radius Comparison */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Proximity Radius</h2>
        <p className="text-neutral-400 mb-8">
          Different proximity detection ranges. The dashed border shows the detection area.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[50, 100, 200, 300].map((radius) => (
            <div key={radius} className="flex flex-col items-center gap-4">
              <span className="text-neutral-400 text-sm">{radius}px radius</span>
              <AnimatedBorder
                trigger="proximity"
                proximityRadius={radius}
                mode="outer"
                color="rgba(251, 191, 36, 1)"
                duration={2500}
                lightSize={60}
                glowBlur={20}
                paused={isPaused}
                debug
              >
                <div className="w-24 h-24 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                  <span className="text-white text-xs">{radius}px</span>
                </div>
              </AnimatedBorder>
            </div>
          ))}
        </div>
      </section>

      {/* Mode Comparison */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Mode Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(['border', 'inner', 'outer', 'both'] as const).map((mode) => (
            <div key={mode} className="flex flex-col items-center gap-4">
              <span className="text-neutral-400 uppercase tracking-wide text-sm">{mode}</span>
              <AnimatedBorder
                mode={mode}
                color="rgba(168, 85, 247, 1)"
                duration={duration}
                lightSize={lightSize}
                paused={isPaused}
              >
                <div className="w-48 h-32 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                  <span className="text-white font-medium">{mode} mode</span>
                </div>
              </AnimatedBorder>
            </div>
          ))}
        </div>
      </section>

      {/* Different Element Types */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Various Element Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Button */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-400 text-sm">Button</span>
            <AnimatedBorder
              mode="border"
              color="rgba(34, 197, 94, 1)"
              duration={duration}
              lightSize={80}
              paused={isPaused}
            >
              <button className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors">
                Click Me
              </button>
            </AnimatedBorder>
          </div>

          {/* Input */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-400 text-sm">Input Field</span>
            <AnimatedBorder
              mode="outer"
              color="rgba(59, 130, 246, 1)"
              duration={duration}
              lightSize={120}
              paused={isPaused}
            >
              <input
                type="text"
                placeholder="Type something..."
                className="px-4 py-3 bg-neutral-800 text-white border border-neutral-600 rounded-lg focus:outline-none focus:border-blue-500 w-56"
              />
            </AnimatedBorder>
          </div>

          {/* Card */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-400 text-sm">Card</span>
            <AnimatedBorder
              mode="inner"
              color="rgba(244, 63, 94, 1)"
              duration={duration}
              lightSize={150}
              paused={isPaused}
            >
              <div className="w-64 p-6 bg-neutral-800 rounded-xl border border-neutral-700">
                <h3 className="text-lg font-semibold text-white mb-2">Card Title</h3>
                <p className="text-neutral-400 text-sm">
                  Some descriptive text about this card component.
                </p>
              </div>
            </AnimatedBorder>
          </div>

          {/* Image */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-400 text-sm">Image</span>
            <AnimatedBorder
              mode="both"
              color="rgba(251, 191, 36, 1)"
              duration={duration}
              lightSize={100}
              paused={isPaused}
            >
              <div className="w-40 h-40 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-6xl">🖼️</span>
              </div>
            </AnimatedBorder>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-400 text-sm">Avatar (Circle)</span>
            <AnimatedBorder
              mode="border"
              color="rgba(236, 72, 153, 1)"
              duration={2000}
              lightSize={60}
              borderRadius="9999px"
              paused={isPaused}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
            </AnimatedBorder>
          </div>

          {/* Badge */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-400 text-sm">Badge</span>
            <AnimatedBorder
              mode="outer"
              color="rgba(139, 92, 246, 1)"
              duration={1500}
              lightSize={50}
              glowBlur={10}
              paused={isPaused}
            >
              <span className="px-4 py-1 bg-violet-600 text-white text-sm font-medium rounded-full">
                New Feature
              </span>
            </AnimatedBorder>
          </div>
        </div>
      </section>

      {/* Color Variations */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Color Variations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { color: 'rgba(239, 68, 68, 1)', name: 'Red' },
            { color: 'rgba(249, 115, 22, 1)', name: 'Orange' },
            { color: 'rgba(234, 179, 8, 1)', name: 'Yellow' },
            { color: 'rgba(34, 197, 94, 1)', name: 'Green' },
            { color: 'rgba(6, 182, 212, 1)', name: 'Cyan' },
            { color: 'rgba(59, 130, 246, 1)', name: 'Blue' },
          ].map(({ color, name }) => (
            <div key={name} className="flex flex-col items-center gap-3">
              <AnimatedBorder
                mode="border"
                color={color}
                duration={2500}
                lightSize={60}
                paused={isPaused}
              >
                <div className="w-20 h-20 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                  <span className="text-white text-xs">{name}</span>
                </div>
              </AnimatedBorder>
            </div>
          ))}
        </div>
      </section>

      {/* Gradient Effects (Secondary Color) */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Gradient Effects (with Secondary Color)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-400 text-sm">Purple → Blue</span>
            <AnimatedBorder
              mode="outer"
              color="rgba(168, 85, 247, 1)"
              secondaryColor="rgba(59, 130, 246, 0.3)"
              duration={duration}
              lightSize={140}
              paused={isPaused}
            >
              <div className="w-48 h-32 bg-neutral-800 rounded-xl flex items-center justify-center border border-neutral-700">
                <span className="text-white">Gradient 1</span>
              </div>
            </AnimatedBorder>
          </div>

          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-400 text-sm">Pink → Orange</span>
            <AnimatedBorder
              mode="both"
              color="rgba(236, 72, 153, 1)"
              secondaryColor="rgba(251, 146, 60, 0.3)"
              duration={duration}
              lightSize={140}
              paused={isPaused}
            >
              <div className="w-48 h-32 bg-neutral-800 rounded-xl flex items-center justify-center border border-neutral-700">
                <span className="text-white">Gradient 2</span>
              </div>
            </AnimatedBorder>
          </div>

          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-400 text-sm">Cyan → Green</span>
            <AnimatedBorder
              mode="inner"
              color="rgba(6, 182, 212, 1)"
              secondaryColor="rgba(34, 197, 94, 0.3)"
              duration={duration}
              lightSize={140}
              paused={isPaused}
            >
              <div className="w-48 h-32 bg-neutral-800 rounded-xl flex items-center justify-center border border-neutral-700">
                <span className="text-white">Gradient 3</span>
              </div>
            </AnimatedBorder>
          </div>
        </div>
      </section>

      {/* Direction Comparison */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Animation Direction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-400 text-sm">Clockwise</span>
            <AnimatedBorder
              mode="border"
              color="rgba(168, 85, 247, 1)"
              duration={3000}
              direction="clockwise"
              lightSize={100}
              debug
              paused={isPaused}
            >
              <div className="w-64 h-40 bg-neutral-800 rounded-xl flex items-center justify-center border border-neutral-700">
                <span className="text-white text-lg">→ Clockwise</span>
              </div>
            </AnimatedBorder>
          </div>

          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-400 text-sm">Counter-Clockwise</span>
            <AnimatedBorder
              mode="border"
              color="rgba(168, 85, 247, 1)"
              duration={3000}
              direction="counterclockwise"
              lightSize={100}
              debug
              paused={isPaused}
            >
              <div className="w-64 h-40 bg-neutral-800 rounded-xl flex items-center justify-center border border-neutral-700">
                <span className="text-white text-lg">← Counter</span>
              </div>
            </AnimatedBorder>
          </div>
        </div>
      </section>

      {/* Speed Variations */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Speed Variations</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { duration: 1000, label: 'Fast (1s)' },
            { duration: 3000, label: 'Normal (3s)' },
            { duration: 6000, label: 'Slow (6s)' },
            { duration: 10000, label: 'Very Slow (10s)' },
          ].map(({ duration: d, label }) => (
            <div key={label} className="flex flex-col items-center gap-4">
              <span className="text-neutral-400 text-sm">{label}</span>
              <AnimatedBorder
                mode="border"
                color="rgba(34, 197, 94, 1)"
                duration={d}
                lightSize={80}
                paused={isPaused}
              >
                <div className="w-full h-24 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                  <span className="text-white text-sm">{d}ms</span>
                </div>
              </AnimatedBorder>
            </div>
          ))}
        </div>
      </section>

      {/* Complex Nested Elements */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Complex Nested Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Form Card */}
          <div className="flex flex-col gap-4">
            <span className="text-neutral-400 text-sm">Form Card</span>
            <AnimatedBorder
              mode="outer"
              color="rgba(99, 102, 241, 1)"
              duration={4000}
              lightSize={180}
              glowBlur={20}
              paused={isPaused}
            >
              <div className="p-8 bg-neutral-800 rounded-2xl border border-neutral-700 w-full max-w-sm">
                <h3 className="text-xl font-bold text-white mb-6">Sign In</h3>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-neutral-700 text-white rounded-lg focus:outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-neutral-700 text-white rounded-lg focus:outline-none"
                  />
                  <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors">
                    Continue
                  </button>
                </div>
              </div>
            </AnimatedBorder>
          </div>

          {/* Stats Card */}
          <div className="flex flex-col gap-4">
            <span className="text-neutral-400 text-sm">Stats Card</span>
            <AnimatedBorder
              mode="both"
              color="rgba(236, 72, 153, 1)"
              secondaryColor="rgba(168, 85, 247, 0.4)"
              duration={5000}
              lightSize={200}
              glowBlur={25}
              paused={isPaused}
            >
              <div className="p-8 bg-neutral-800 rounded-2xl border border-neutral-700 w-full max-w-sm">
                <h3 className="text-xl font-bold text-white mb-6">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-neutral-700 rounded-lg">
                    <span className="block text-3xl font-bold text-white">2.4K</span>
                    <span className="text-neutral-400 text-sm">Users</span>
                  </div>
                  <div className="text-center p-4 bg-neutral-700 rounded-lg">
                    <span className="block text-3xl font-bold text-white">99%</span>
                    <span className="text-neutral-400 text-sm">Uptime</span>
                  </div>
                  <div className="text-center p-4 bg-neutral-700 rounded-lg">
                    <span className="block text-3xl font-bold text-white">48</span>
                    <span className="text-neutral-400 text-sm">Servers</span>
                  </div>
                  <div className="text-center p-4 bg-neutral-700 rounded-lg">
                    <span className="block text-3xl font-bold text-white">5ms</span>
                    <span className="text-neutral-400 text-sm">Latency</span>
                  </div>
                </div>
              </div>
            </AnimatedBorder>
          </div>
        </div>
      </section>

      {/* Multiple Animated Borders */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Multiple Simultaneous Animations</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <AnimatedBorder
              key={i}
              mode={(['border', 'inner', 'outer', 'both'] as const)[i % 4]}
              color={`hsl(${i * 45}, 70%, 60%)`}
              duration={2000 + i * 500}
              lightSize={60 + i * 10}
              direction={i % 2 === 0 ? 'clockwise' : 'counterclockwise'}
              paused={isPaused}
            >
              <div className="w-20 h-20 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="text-white font-bold">{i + 1}</span>
              </div>
            </AnimatedBorder>
          ))}
        </div>
      </section>

      {/* Real-world Use Cases */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Real-World Use Cases</h2>
        <div className="space-y-12">
          
          {/* CTA Button */}
          <div className="flex flex-col items-center gap-6">
            <span className="text-neutral-400">Call-to-Action Button</span>
            <AnimatedBorder
              mode="outer"
              color="rgba(168, 85, 247, 1)"
              secondaryColor="rgba(236, 72, 153, 0.5)"
              duration={2500}
              lightSize={120}
              glowBlur={25}
              paused={isPaused}
            >
              <button className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl">
                Get Started for Free
              </button>
            </AnimatedBorder>
          </div>

          {/* Feature Highlight */}
          <div className="flex justify-center">
            <AnimatedBorder
              mode="both"
              color="rgba(251, 191, 36, 1)"
              secondaryColor="rgba(251, 146, 60, 0.3)"
              duration={6000}
              lightSize={250}
              glowBlur={30}
              paused={isPaused}
            >
              <div className="max-w-2xl p-10 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl border border-neutral-700">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">Lightning Fast Performance</h3>
                    <p className="text-neutral-400 leading-relaxed">
                      Experience blazing-fast animations with our optimized rendering engine. 
                      Built with requestAnimationFrame for smooth 60fps animations that won't 
                      impact your application's performance.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedBorder>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AnimatedBorderSection;
