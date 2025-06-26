'use client';

import React from 'react';
import { Gallery } from '../../components/gallery/gallery';

// Sample gallery data - using placeholder images for now
const galleryItems = [
  {
    id: 1,
    title: "Neon Dreams",
    imageUrl: "https://picsum.photos/300/400?random=1"
  },
  {
    id: 2,
    title: "Digital Horizon",
    imageUrl: "https://picsum.photos/300/400?random=2"
  },
  {
    id: 3,
    title: "Electric Pulse",
    imageUrl: "https://picsum.photos/300/400?random=3"
  },
  {
    id: 4,
    title: "Cyber Vista",
    imageUrl: "https://picsum.photos/300/400?random=4"
  },
  {
    id: 5,
    title: "Quantum Glow",
    imageUrl: "https://picsum.photos/300/400?random=5"
  },
  {
    id: 6,
    title: "Fractal Energy",
    imageUrl: "https://picsum.photos/300/400?random=6"
  },
  {
    id: 7,
    title: "Matrix Flow",
    imageUrl: "https://picsum.photos/300/400?random=7"
  },
  {
    id: 8,
    title: "Binary Storm",
    imageUrl: "https://picsum.photos/300/400?random=8"
  },
  {
    id: 9,
    title: "Neural Network",
    imageUrl: "https://picsum.photos/300/400?random=9"
  },
  {
    id: 10,
    title: "Data Stream",
    imageUrl: "https://picsum.photos/300/400?random=10"
  }
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
            Cursor Gallery
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Hover over the titles to see the magic of CustomCursor in action
          </p>
        </div>
        
        <Gallery items={galleryItems} />
      </div>
    </main>
  );
}