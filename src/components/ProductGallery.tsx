"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: { node: { url: string; altText?: string } }[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // If no images exist, show the fallback
  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-50 rounded-[2rem] p-6 md:p-8 border border-gray-100 flex items-center justify-center aspect-square relative overflow-hidden shadow-sm">
        <div className="text-gray-400 font-medium">No Image Available</div>
      </div>
    );
  }

  const activeImage = images[activeIndex]?.node;

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* Main Large Image */}
      <div className="bg-gray-50 rounded-[2rem] p-6 md:p-8 border border-gray-100 flex items-center justify-center aspect-square relative overflow-hidden shadow-sm">
        <Image 
          src={activeImage.url} 
          alt={activeImage.altText || title} 
          fill 
          className="object-contain p-4 md:p-8 transition-transform duration-500 hover:scale-105"
          priority
        />
      </div>

      {/* Thumbnail Row (Only shows if there is more than 1 image) */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {images.map((edge, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all snap-start ${
                activeIndex === index 
                  ? "border-blue-600 shadow-md ring-2 ring-blue-600/20" 
                  : "border-transparent bg-gray-50 hover:border-gray-200"
              }`}
            >
              <Image 
                src={edge.node.url} 
                alt={edge.node.altText || `${title} thumbnail ${index + 1}`} 
                fill 
                className="object-cover p-2"
              />
            </button>
          ))}
        </div>
      )}
      
    </div>
  );
}