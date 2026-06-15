"use client";

import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, Loader2, X } from 'lucide-react';

export default function ImageUpload({ 
  value, // The current image URL (if any)
  onChange, // Function to call when an image is successfully uploaded (passes the URL)
  onRemove, // Function to call to remove the current image
  disabled = false,
  className = ""
}) {
  const onUpload = (result) => {
    if (result.info && result.info.secure_url) {
      onChange(result.info.secure_url);
    }
  };

  return (
    <div className={`space-y-4 w-full ${className}`}>
      {value ? (
        <div className="relative w-full max-w-[200px] aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={value} 
            alt="Uploaded image" 
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-transform transform hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <CldUploadWidget 
          onSuccess={onUpload} 
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"} // You need to set this in Cloudinary
          options={{
            maxFiles: 1,
            resourceType: "image"
          }}
        >
          {({ open, isLoading }) => {
            const onClick = (e) => {
              e.preventDefault();
              open();
            };

            return (
              <button 
                type="button" 
                disabled={disabled || isLoading}
                onClick={onClick}
                className="w-full max-w-[200px] aspect-square rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-purple-400 transition-all flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-purple-600 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <ImagePlus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Tải ảnh lên</span>
                  </>
                )}
              </button>
            );
          }}
        </CldUploadWidget>
      )}
    </div>
  );
}
