'use client';

import { useState } from 'react';
import Image from 'next/image';

type ImageItem = {
  src: string;
  alt?: string;
};

type GalleryProps = {
  images: ImageItem[];
};

export default function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  if (!images.length) return null;

  const openModal = (image: ImageItem) => setSelectedImage(image);
  const closeModal = () => setSelectedImage(null);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {/* Main image */}
        <button
          type="button"
          onClick={() => openModal(images[0])}
          className="relative col-span-2 lg:col-span-2 rounded-2xl overflow-hidden aspect-[4/3] max-h-[520px] hover:opacity-95 transition-opacity"
          aria-label="Open gallery"
        >
          <Image
            src={images[0].src}
            alt={images[0].alt || 'Main property image'}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover select-none"
            priority
          />
        </button>

        {/* Thumbnail images */}
        {images.slice(1, 5).map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => openModal(image)}
            className="relative rounded-2xl overflow-hidden aspect-[4/3] max-h-[240px] hover:opacity-95 transition-opacity"
            aria-label={`Open photo ${index + 2}`}
          >
            <Image
              src={image.src}
              alt={image.alt || `Property image ${index + 2}`}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover select-none"
            />
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
              aria-label="Close modal"
            >
              ×
            </button>
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt || 'Property image'}
              width={800}
              height={600}
              className="rounded-lg max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
