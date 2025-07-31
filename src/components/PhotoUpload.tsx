// src/components/PhotoUpload.tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useUIStore } from '@/lib/store';

interface PhotoUploadProps {
  propertyId?: string;
  onUploadComplete: (urls: string[]) => void;
  existingPhotos?: string[];
  maxFiles?: number;
  className?: string;
}

export default function PhotoUpload({
  propertyId,
  onUploadComplete,
  existingPhotos = [],
  maxFiles = 10,
  className = '',
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { addToast } = useUIStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setUploading(true);
      setUploadProgress(0);

      try {
        const uploadedUrls: string[] = [];
        const totalFiles = acceptedFiles.length;

        for (let i = 0; i < acceptedFiles.length; i++) {
          const file = acceptedFiles[i];

          // Dosya boyutu kontrolü (5MB)
          if (file.size > 5 * 1024 * 1024) {
            addToast({
              type: 'error',
              message: `${file.name} is too large. Maximum size is 5MB.`,
            });
            continue;
          }

          // Dosya tipi kontrolü
          if (!file.type.startsWith('image/')) {
            addToast({
              type: 'error',
              message: `${file.name} is not an image file.`,
            });
            continue;
          }

          // Benzersiz dosya adı oluştur
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = propertyId
            ? `${propertyId}/${fileName}`
            : `temp/${fileName}`;

          // Supabase Storage'a yükle
          const { error } = await supabase.storage
            .from('property-photos')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (error) {
            console.error('Upload error:', error);
            addToast({
              type: 'error',
              message: `Failed to upload ${file.name}: ${error.message}`,
            });
            continue;
          }

          // Public URL al
          const { data: urlData } = supabase.storage
            .from('property-photos')
            .getPublicUrl(filePath);

          uploadedUrls.push(urlData.publicUrl);
          setUploadProgress(((i + 1) / totalFiles) * 100);
        }

        if (uploadedUrls.length > 0) {
          onUploadComplete([...existingPhotos, ...uploadedUrls]);
          addToast({
            type: 'success',
            message: `Successfully uploaded ${uploadedUrls.length} photo(s)`,
          });
        }
      } catch (error) {
        console.error('Upload error:', error);
        addToast({
          type: 'error',
          message: 'Failed to upload photos',
        });
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [propertyId, existingPhotos, onUploadComplete, addToast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: maxFiles - existingPhotos.length,
    disabled: uploading,
  });

  const removePhoto = async (photoUrl: string, index: number) => {
    try {
      // URL'den dosya yolunu çıkar
      const urlParts = photoUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = propertyId
        ? `${propertyId}/${fileName}`
        : `temp/${fileName}`;

      // Supabase Storage'dan sil
      const { error } = await supabase.storage
        .from('property-photos')
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        addToast({
          type: 'error',
          message: 'Failed to delete photo',
        });
        return;
      }

      // Local state'den kaldır
      const newPhotos = existingPhotos.filter((_, i) => i !== index);
      onUploadComplete(newPhotos);

      addToast({
        type: 'success',
        message: 'Photo deleted successfully',
      });
    } catch (error) {
      console.error('Delete error:', error);
      addToast({
        type: 'error',
        message: 'Failed to delete photo',
      });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-blue bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-sm text-gray-600">
            {isDragActive ? (
              <p>Drop the photos here...</p>
            ) : (
              <p>
                <span className="font-medium text-primary-blue hover:text-primary-blue-dark">
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 5MB each
            </p>
            <p className="text-xs text-gray-500">
              {existingPhotos.length}/{maxFiles} photos uploaded
            </p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Uploading...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Existing Photos */}
      {existingPhotos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Uploaded Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingPhotos.map((photo, index) => (
              <div key={index} className="relative group">
                <Image
                  src={photo}
                  alt={`Property photo ${index + 1}`}
                  width={200}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removePhoto(photo, index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove photo"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
