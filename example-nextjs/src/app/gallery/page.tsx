'use client';

import React from 'react';
import { Gallery } from '../../components/gallery/gallery';

// Static gallery data from Unsplash collection with photographer credits
const galleryItems = [
  {
    id: 1,
    title: "Blue House",
    imageUrl: "https://images.unsplash.com/photo-1534670022376-eb2368089516?w=280&h=350&fit=crop&crop=center",
    photographer: "Annie Spratt"
  },
  {
    id: 2,
    title: "Yellow Object",
    imageUrl: "https://images.unsplash.com/photo-1720788051492-f6eaa0025cc5?w=280&h=350&fit=crop&crop=center",
    photographer: "Edoardo Matteoni"
  },
  {
    id: 3,
    title: "Arched Corridor",
    imageUrl: "https://images.unsplash.com/photo-1746542296681-2ed4aa1b8133?w=280&h=350&fit=crop&crop=center",
    photographer: "Raghavendra Badaskar"
  },
  {
    id: 4,
    title: "USGS Landscape",
    imageUrl: "https://images.unsplash.com/photo-1722080768196-8983bbbb5c0f?w=280&h=350&fit=crop&crop=center",
    photographer: "USGS"
  },
  {
    id: 5,
    title: "Wooden Frame",
    imageUrl: "https://images.unsplash.com/photo-1614621589216-7bb3a18a4fc8?w=280&h=350&fit=crop&crop=center",
    photographer: "Luke Oslizlo"
  },
  {
    id: 6,
    title: "Abstract Texture",
    imageUrl: "https://images.unsplash.com/photo-1556139954-ec19cce61d61?w=280&h=350&fit=crop&crop=center",
    photographer: "Pawel Czerwinski"
  },
  {
    id: 7,
    title: "Geometric Forms",
    imageUrl: "https://images.unsplash.com/photo-1534670022376-eb2368089516?w=280&h=350&fit=crop&crop=center",
    photographer: "Annie Spratt"
  },
  {
    id: 8,
    title: "Minimalist Space",
    imageUrl: "https://images.unsplash.com/photo-1720788051492-f6eaa0025cc5?w=280&h=350&fit=crop&crop=center",
    photographer: "Edoardo Matteoni"
  },
  {
    id: 9,
    title: "Dramatic Light",
    imageUrl: "https://images.unsplash.com/photo-1746542296681-2ed4aa1b8133?w=280&h=350&fit=crop&crop=center",
    photographer: "Raghavendra Badaskar"
  },
  {
    id: 10,
    title: "Natural Tones",
    imageUrl: "https://images.unsplash.com/photo-1722080768196-8983bbbb5c0f?w=280&h=350&fit=crop&crop=center",
    photographer: "USGS"
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