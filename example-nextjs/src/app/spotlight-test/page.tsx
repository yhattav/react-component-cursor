'use client';

import React, { useState } from 'react';
import { CursorSpotlight } from '@yhattav/react-component-cursor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type SpotlightMode = 'border' | 'inner' | 'outer' | 'fill';

interface DemoSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function DemoSection({ title, description, children }: DemoSectionProps) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-6 text-sm">{description}</p>
      <div className="flex flex-wrap gap-6">
        {children}
      </div>
    </div>
  );
}

function ModeSelector({ 
  mode, 
  onChange 
}: { 
  mode: SpotlightMode; 
  onChange: (mode: SpotlightMode) => void;
}) {
  const modes: SpotlightMode[] = ['border', 'inner', 'outer', 'fill'];
  
  return (
    <div className="flex gap-2">
      {modes.map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
            mode === m
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

export default function SpotlightTestPage() {
  const [globalMode, setGlobalMode] = useState<SpotlightMode>('border');

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Global Settings */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            CursorSpotlight Test Page
          </h1>
          <p className="text-gray-400 mb-4">
            Move your cursor over elements to see the spotlight effect.
          </p>
          
          <div className="bg-gray-900 p-4 rounded-xl flex items-center gap-4">
            <span className="text-white font-medium text-sm">Global Mode:</span>
            <ModeSelector mode={globalMode} onChange={setGlobalMode} />
          </div>
        </header>

        {/* Tabbed Content */}
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="mb-6 bg-gray-900 p-1">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="shadcn">Shadcn UI</TabsTrigger>
          </TabsList>

          {/* TAB: Basics */}
          <TabsContent value="basics" className="space-y-8">
            {/* Basic Shapes */}
            <DemoSection
              title="Basic Shapes"
              description="Testing different border-radius values."
            >
              <CursorSpotlight mode={globalMode} glowColor="rgba(168, 85, 247, 0.9)">
                <div className="w-28 h-28 bg-gray-800 rounded-none flex items-center justify-center text-gray-400 text-sm">
                  Square
                </div>
              </CursorSpotlight>

              <CursorSpotlight mode={globalMode} glowColor="rgba(168, 85, 247, 0.9)">
                <div className="w-28 h-28 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  Rounded
                </div>
              </CursorSpotlight>

              <CursorSpotlight mode={globalMode} glowColor="rgba(168, 85, 247, 0.9)">
                <div className="w-28 h-28 bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
                  More Round
                </div>
              </CursorSpotlight>

              <CursorSpotlight mode={globalMode} glowColor="rgba(168, 85, 247, 0.9)">
                <div className="w-28 h-28 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 text-sm">
                  Circle
                </div>
              </CursorSpotlight>

              <CursorSpotlight mode={globalMode} glowColor="rgba(168, 85, 247, 0.9)">
                <div className="w-40 h-14 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 text-sm">
                  Pill
                </div>
              </CursorSpotlight>
            </DemoSection>

            {/* Mode Comparison */}
            <DemoSection
              title="Mode Comparison"
              description="Same element with different spotlight modes."
            >
              <div className="text-center">
                <CursorSpotlight mode="border" glowColor="rgba(59, 130, 246, 0.9)">
                  <div className="w-36 h-28 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                    border
                  </div>
                </CursorSpotlight>
                <span className="text-gray-500 text-xs mt-2 block">border</span>
              </div>

              <div className="text-center">
                <CursorSpotlight mode="inner" glowColor="rgba(59, 130, 246, 0.9)">
                  <div className="w-36 h-28 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                    inner
                  </div>
                </CursorSpotlight>
                <span className="text-gray-500 text-xs mt-2 block">inner</span>
              </div>

              <div className="text-center">
                <CursorSpotlight mode="outer" glowColor="rgba(59, 130, 246, 0.9)">
                  <div className="w-36 h-28 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                    outer
                  </div>
                </CursorSpotlight>
                <span className="text-gray-500 text-xs mt-2 block">outer</span>
              </div>

              <div className="text-center">
                <CursorSpotlight mode="fill" glowColor="rgba(59, 130, 246, 0.9)">
                  <div className="w-36 h-28 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                    fill
                  </div>
                </CursorSpotlight>
                <span className="text-gray-500 text-xs mt-2 block">fill</span>
              </div>
            </DemoSection>

            {/* Colors */}
            <DemoSection
              title="Colors"
              description="Various glow colors."
            >
              {[
                { color: 'rgba(239, 68, 68, 0.9)', name: 'Red', text: 'text-red-400' },
                { color: 'rgba(34, 197, 94, 0.9)', name: 'Green', text: 'text-green-400' },
                { color: 'rgba(59, 130, 246, 0.9)', name: 'Blue', text: 'text-blue-400' },
                { color: 'rgba(234, 179, 8, 0.9)', name: 'Yellow', text: 'text-yellow-400' },
                { color: 'rgba(236, 72, 153, 0.9)', name: 'Pink', text: 'text-pink-400' },
                { color: 'rgba(6, 182, 212, 0.9)', name: 'Cyan', text: 'text-cyan-400' },
              ].map(({ color, name, text }) => (
                <CursorSpotlight key={name} mode={globalMode} glowColor={color}>
                  <div className={`w-24 h-24 bg-gray-800 rounded-xl flex items-center justify-center ${text}`}>
                    {name}
                  </div>
                </CursorSpotlight>
              ))}
            </DemoSection>
          </TabsContent>

          {/* TAB: Effects */}
          <TabsContent value="effects" className="space-y-8">
            {/* Gradients */}
            <DemoSection
              title="Gradient Effects"
              description="Radial, conic, and linear gradients."
            >
              <div className="text-center">
                <CursorSpotlight 
                  mode="fill" 
                  gradient={{ type: 'radial', colors: ['rgba(168, 85, 247, 0.8)', 'rgba(59, 130, 246, 0.8)', 'transparent'] }}
                >
                  <div className="w-36 h-28 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                    Radial
                  </div>
                </CursorSpotlight>
                <span className="text-gray-500 text-xs mt-2 block">radial</span>
              </div>

              <div className="text-center">
                <CursorSpotlight 
                  mode="fill" 
                  gradient={{ type: 'conic', colors: ['#f43f5e', '#8b5cf6', '#3b82f6', '#10b981', '#f43f5e'], angle: 0 }}
                >
                  <div className="w-36 h-28 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                    Conic
                  </div>
                </CursorSpotlight>
                <span className="text-gray-500 text-xs mt-2 block">conic</span>
              </div>

              <div className="text-center">
                <CursorSpotlight 
                  mode="fill" 
                  gradient={{ type: 'linear', colors: ['#ec4899', '#8b5cf6'], angle: 45 }}
                >
                  <div className="w-36 h-28 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                    Linear
                  </div>
                </CursorSpotlight>
                <span className="text-gray-500 text-xs mt-2 block">linear 45°</span>
              </div>
            </DemoSection>

            {/* Glow Radius */}
            <DemoSection
              title="Glow Radius"
              description="Different spotlight sizes."
            >
              {[100, 200, 300, 400].map((radius) => (
                <div key={radius} className="text-center">
                  <CursorSpotlight mode={globalMode} glowColor="rgba(168, 85, 247, 0.9)" glowRadius={radius}>
                    <div className="w-32 h-24 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                      {radius}px
                    </div>
                  </CursorSpotlight>
                  <span className="text-gray-500 text-xs mt-2 block">{radius}px</span>
                </div>
              ))}
            </DemoSection>

            {/* Glow Intensity */}
            <DemoSection
              title="Glow Intensity"
              description="Different intensity levels (affects blur and spread)."
            >
              {[0.5, 1, 2, 3].map((intensity) => (
                <div key={intensity} className="text-center">
                  <CursorSpotlight mode="outer" glowColor="rgba(59, 130, 246, 0.9)" glowIntensity={intensity}>
                    <div className="w-32 h-24 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                      {intensity}x
                    </div>
                  </CursorSpotlight>
                  <span className="text-gray-500 text-xs mt-2 block">{intensity}x</span>
                </div>
              ))}
            </DemoSection>

            {/* Border Width */}
            <DemoSection
              title="Border Width (border mode)"
              description="Different border thicknesses."
            >
              {[1, 2, 4, 8].map((width) => (
                <div key={width} className="text-center">
                  <CursorSpotlight mode="border" glowColor="rgba(236, 72, 153, 0.9)" borderWidth={width}>
                    <div className="w-32 h-24 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                      {width}px
                    </div>
                  </CursorSpotlight>
                  <span className="text-gray-500 text-xs mt-2 block">{width}px</span>
                </div>
              ))}
            </DemoSection>
          </TabsContent>

          {/* TAB: Behavior */}
          <TabsContent value="behavior" className="space-y-8">
            {/* Smoothness */}
            <DemoSection
              title="Smoothness"
              description="Cursor follow smoothing (lower = snappier, higher = smoother)."
            >
              {[1, 10, 30, 60].map((smoothness) => (
                <div key={smoothness} className="text-center">
                  <CursorSpotlight mode={globalMode} glowColor="rgba(34, 197, 94, 0.9)" smoothness={smoothness}>
                    <div className="w-32 h-24 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                      {smoothness === 1 ? 'Instant' : smoothness === 10 ? 'Default' : smoothness === 30 ? 'Smooth' : 'Very Smooth'}
                    </div>
                  </CursorSpotlight>
                  <span className="text-gray-500 text-xs mt-2 block">{smoothness}</span>
                </div>
              ))}
            </DemoSection>

            {/* Custom Border Radius */}
            <DemoSection
              title="Custom Border Radius Override"
              description="Override the inherited border radius."
            >
              <div className="text-center">
                <CursorSpotlight mode={globalMode} glowColor="rgba(251, 146, 60, 0.9)" customBorderRadius="0px">
                  <div className="w-32 h-24 bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
                    Override 0px
                  </div>
                </CursorSpotlight>
                <span className="text-gray-500 text-xs mt-2 block">child: rounded, override: 0px</span>
              </div>

              <div className="text-center">
                <CursorSpotlight mode={globalMode} glowColor="rgba(251, 146, 60, 0.9)" customBorderRadius="50%">
                  <div className="w-24 h-24 bg-gray-800 rounded-none flex items-center justify-center text-gray-400 text-sm">
                    Override 50%
                  </div>
                </CursorSpotlight>
                <span className="text-gray-500 text-xs mt-2 block">child: square, override: 50%</span>
              </div>

              <div className="text-center">
                <CursorSpotlight mode={globalMode} glowColor="rgba(251, 146, 60, 0.9)" inheritBorderRadius={false}>
                  <div className="w-32 h-24 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 text-sm">
                    No inherit
                  </div>
                </CursorSpotlight>
                <span className="text-gray-500 text-xs mt-2 block">inheritBorderRadius: false</span>
              </div>
            </DemoSection>

            {/* Disabled State */}
            <DemoSection
              title="Disabled State"
              description="Testing the disabled prop."
            >
              <div className="text-center">
                <CursorSpotlight mode={globalMode} glowColor="rgba(168, 85, 247, 0.9)" disabled={false}>
                  <div className="w-32 h-24 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                    Enabled
                  </div>
                </CursorSpotlight>
                <span className="text-gray-500 text-xs mt-2 block">disabled: false</span>
              </div>

              <div className="text-center">
                <CursorSpotlight mode={globalMode} glowColor="rgba(168, 85, 247, 0.9)" disabled={true}>
                  <div className="w-32 h-24 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                    Disabled
                  </div>
                </CursorSpotlight>
                <span className="text-gray-500 text-xs mt-2 block">disabled: true</span>
              </div>
            </DemoSection>
          </TabsContent>

          {/* TAB: Components */}
          <TabsContent value="components" className="space-y-8">
            {/* Real UI Components */}
            <DemoSection
              title="Real UI Components"
              description="Testing with typical UI elements."
            >
              <CursorSpotlight mode="border" glowColor="rgba(168, 85, 247, 0.9)">
                <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                  Button
                </button>
              </CursorSpotlight>

              <CursorSpotlight mode="outer" glowColor="rgba(59, 130, 246, 0.9)">
                <button className="px-6 py-3 bg-transparent border-2 border-blue-500 text-blue-400 font-semibold rounded-lg hover:bg-blue-500/10 transition-colors">
                  Outline
                </button>
              </CursorSpotlight>

              <CursorSpotlight mode="border" glowColor="rgba(234, 179, 8, 0.9)">
                <button className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-400 transition-colors">
                  Pill
                </button>
              </CursorSpotlight>

              <CursorSpotlight mode="outer" glowColor="rgba(6, 182, 212, 0.9)" glowIntensity={1.5}>
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="Avatar"
                  className="w-16 h-16 rounded-full bg-gray-700"
                />
              </CursorSpotlight>
            </DemoSection>

            {/* Nested Elements */}
            <DemoSection
              title="Complex Nested Elements"
              description="Elements with multiple children."
            >
              <CursorSpotlight mode={globalMode} glowColor="rgba(168, 85, 247, 0.9)">
                <div className="w-64 bg-gray-800 rounded-2xl overflow-hidden">
                  <div className="h-24 bg-gradient-to-br from-purple-500 to-pink-500" />
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-1">Feature Card</h3>
                    <p className="text-gray-400 text-sm mb-2">A card with image header.</p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">Tag 1</span>
                      <span className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded">Tag 2</span>
                    </div>
                  </div>
                </div>
              </CursorSpotlight>

              <CursorSpotlight mode={globalMode} glowColor="rgba(34, 197, 94, 0.9)">
                <div className="w-56 bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">J</div>
                    <div>
                      <div className="text-white font-medium">John Doe</div>
                      <div className="text-gray-500 text-sm">@johndoe</div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">Amazing cursor library! 🚀</p>
                </div>
              </CursorSpotlight>
            </DemoSection>

            {/* Large Elements */}
            <DemoSection
              title="Large Elements"
              description="Testing spotlight on larger containers."
            >
              <CursorSpotlight mode={globalMode} glowColor="rgba(139, 92, 246, 0.9)" glowRadius={400}>
                <div className="w-full max-w-xl h-40 bg-gray-800 rounded-3xl flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Large Container</h3>
                    <p className="text-gray-400 text-sm">Move cursor around to see the effect travel.</p>
                  </div>
                </div>
              </CursorSpotlight>
            </DemoSection>

            {/* Grid */}
            <DemoSection
              title="Grid of Items"
              description="Multiple small items with individual spotlights."
            >
              <div className="grid grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <CursorSpotlight key={i} mode={globalMode} glowColor={`hsl(${i * 45}, 70%, 60%)`} glowRadius={80}>
                    <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 font-mono text-sm">
                      {i + 1}
                    </div>
                  </CursorSpotlight>
                ))}
              </div>
            </DemoSection>
          </TabsContent>

          {/* TAB: Shadcn UI */}
          <TabsContent value="shadcn" className="space-y-8">
            {/* Buttons */}
            <DemoSection
              title="Shadcn Buttons"
              description="Production-ready button variants."
            >
              <CursorSpotlight mode={globalMode} glowColor="rgba(168, 85, 247, 0.9)">
                <Button>Default</Button>
              </CursorSpotlight>

              <CursorSpotlight mode={globalMode} glowColor="rgba(59, 130, 246, 0.9)">
                <Button variant="secondary">Secondary</Button>
              </CursorSpotlight>

              <CursorSpotlight mode={globalMode} glowColor="rgba(239, 68, 68, 0.9)">
                <Button variant="destructive">Destructive</Button>
              </CursorSpotlight>

              <CursorSpotlight mode={globalMode} glowColor="rgba(34, 197, 94, 0.9)">
                <Button variant="outline">Outline</Button>
              </CursorSpotlight>

              <CursorSpotlight mode={globalMode} glowColor="rgba(234, 179, 8, 0.9)">
                <Button variant="ghost">Ghost</Button>
              </CursorSpotlight>

              <CursorSpotlight mode={globalMode} glowColor="rgba(6, 182, 212, 0.9)">
                <Button size="lg">Large</Button>
              </CursorSpotlight>
            </DemoSection>

            {/* Badges & Avatar */}
            <DemoSection
              title="Badges & Avatar"
              description="Small UI elements."
            >
              <CursorSpotlight mode="border" glowColor="rgba(168, 85, 247, 0.9)">
                <Badge>Default</Badge>
              </CursorSpotlight>

              <CursorSpotlight mode="border" glowColor="rgba(59, 130, 246, 0.9)">
                <Badge variant="secondary">Secondary</Badge>
              </CursorSpotlight>

              <CursorSpotlight mode="border" glowColor="rgba(239, 68, 68, 0.9)">
                <Badge variant="destructive">Destructive</Badge>
              </CursorSpotlight>

              <CursorSpotlight mode="border" glowColor="rgba(34, 197, 94, 0.9)">
                <Badge variant="outline">Outline</Badge>
              </CursorSpotlight>

              <CursorSpotlight mode="outer" glowColor="rgba(236, 72, 153, 0.9)" glowIntensity={1.5}>
                <Avatar className="h-14 w-14">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </CursorSpotlight>

              <CursorSpotlight mode="border" glowColor="rgba(168, 85, 247, 0.9)" glowRadius={150}>
                <Input placeholder="Type something..." className="w-56" />
              </CursorSpotlight>
            </DemoSection>

            {/* Cards */}
            <DemoSection
              title="Shadcn Cards"
              description="Full card components."
            >
              <CursorSpotlight mode={globalMode} glowColor="rgba(168, 85, 247, 0.9)" glowRadius={280}>
                <Card className="w-72">
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description here.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This is the card content area.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">Cancel</Button>
                    <Button size="sm">Submit</Button>
                  </CardFooter>
                </Card>
              </CursorSpotlight>

              <CursorSpotlight mode="outer" glowColor="rgba(59, 130, 246, 0.9)" glowRadius={220}>
                <Card className="w-64">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">Shadcn</CardTitle>
                      <CardDescription>@shadcn</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Beautiful components.</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" className="w-full">Follow</Button>
                  </CardFooter>
                </Card>
              </CursorSpotlight>

              <CursorSpotlight mode="inner" glowColor="rgba(34, 197, 94, 0.9)" glowRadius={180}>
                <Card className="w-56">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Notifications</CardTitle>
                      <Badge>3</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-xs">New message</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="text-xs">Project updated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500" />
                      <span className="text-xs">New follower</span>
                    </div>
                  </CardContent>
                </Card>
              </CursorSpotlight>
            </DemoSection>

            {/* Form Card */}
            <DemoSection
              title="Interactive Form"
              description="Complete form with spotlight."
            >
              <CursorSpotlight mode={globalMode} glowColor="rgba(139, 92, 246, 0.9)" glowRadius={320}>
                <Card className="w-80">
                  <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>Enter your details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" placeholder="email@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Free</Badge>
                      <Badge variant="outline">14-day trial</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full">Create Account</Button>
                    <Button variant="ghost" className="w-full">Have an account?</Button>
                  </CardFooter>
                </Card>
              </CursorSpotlight>
            </DemoSection>
          </TabsContent>
        </Tabs>

        <footer className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>CursorSpotlight Component Test Page</p>
          <p className="mt-1">@yhattav/react-component-cursor</p>
        </footer>
      </div>
    </div>
  );
}
