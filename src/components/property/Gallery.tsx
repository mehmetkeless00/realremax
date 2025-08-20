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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Main image */}
        <div className="md:col-span-2 md:row-span-2">
          <button
            onClick={() => openModal(images[0])}
            className="w-full h-64 md:h-80 rounded-2xl overflow-hidden hover:opacity-95 transition-opacity"
          >
            <Image
              src={images[0].src}
              alt={images[0].alt || 'Main property image'}
              fill
              className="object-cover"
            />
          </button>
        </div>

        {/* Thumbnail images */}
        {images.slice(1, 5).map((image, index) => (
          <div key={index} className="md:col-span-1">
            <button
              onClick={() => openModal(image)}
              className="w-full h-32 md:h-40 rounded-2xl overflow-hidden hover:opacity-95 transition-opacity"
            >
              <Image
                src={image.src}
                alt={image.alt || `Property image ${index + 2}`}
                fill
                className="object-cover"
              />
            </button>
          </div>
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
