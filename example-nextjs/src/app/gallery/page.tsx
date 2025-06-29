'use client';

import React from 'react';
import { Gallery } from '../../components/gallery/gallery';

// Static gallery data from Unsplash collections with photographer credits
// Main collection: https://unsplash.com/collections/gqB4Wz3Rbww/Gallery-Photos
// Split collection: https://unsplash.com/collections/9wzfIe6cwVs/split-collection
// Fixed: All 10 unique images, no duplicates, correct attributions
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
    title: "Landscape",
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
    title: "Poppy Field",
    imageUrl: "https://images.unsplash.com/photo-1748549812944-2f39b088e4d5?w=280&h=350&fit=crop&crop=center",
    photographer: "Anna Spoljar"
  },
  {
    id: 8,
    title: "Orange Bubbles",
    imageUrl: "https://images.unsplash.com/photo-1518842013791-b874be246c34?w=280&h=350&fit=crop&crop=center",
    photographer: "Sharon Pittaway"
  },
  {
    id: 9,
    title: "Fiery Abstract",
    imageUrl: "https://images.unsplash.com/photo-1744035522988-08bf64003759?w=280&h=350&fit=crop&crop=center",
    photographer: "Solen Feyissa"
  },
  {
    id: 10,
    title: "Ocean Waves",
    imageUrl: "https://images.unsplash.com/photo-1497449711066-ecd7e3d6a484?w=280&h=350&fit=crop&crop=center",
    photographer: "Jorge Vasconez"
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