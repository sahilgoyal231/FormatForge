"use client";

import React, { useState, useEffect, useRef } from "react";
import { getCldImageUrl } from "next-cloudinary";
import { Upload, Download, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";
import toast from 'react-hot-toast';

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Instagram Story (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
  "Facebook Post (1.91:1)": { width: 1200, height: 630, aspectRatio: "1.91:1" },
  "LinkedIn Post (1.91:1)": { width: 1200, height: 628, aspectRatio: "1.91:1" },
  "YouTube Thumbnail (16:9)": { width: 1280, height: 720, aspectRatio: "16:9" },
  "Pinterest Pin (2:3)": { width: 1000, height: 1500, aspectRatio: "2:3" },
  "TikTok Video (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `social-share-${selectedFormat.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-10rem)]">
      {/* Left Pane - Configuration */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Social Format</h1>
          <p className="text-zinc-400">Auto-resize your images for any social platform.</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex-1">
          <div className="space-y-6">
            {!uploadedImage ? (
              <div 
                className="border-2 border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-cyan-500/50 hover:bg-white/5 transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-cyan-400" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {isUploading ? "Uploading..." : "Upload Image"}
                </h3>
                <p className="text-sm text-zinc-400 text-center">
                  Click to select an image from your device
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <ImageIcon className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-white">Image Uploaded</span>
                  </div>
                  <button 
                    onClick={() => {
                      setUploadedImage(null);
                      if(fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-3">
                    Select Target Format
                  </label>
                  <div className="space-y-2">
                    {Object.keys(socialFormats).map((format) => (
                      <button
                        key={format}
                        onClick={() => setSelectedFormat(format as SocialFormat)}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${
                          selectedFormat === format 
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                            : 'bg-zinc-900/30 border-white/10 text-zinc-400 hover:bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className="font-medium">{format}</span>
                        {selectedFormat === format && <Sparkles className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Pane - Preview */}
      <div className="w-full lg:w-2/3 glass-panel rounded-3xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-white/10 bg-zinc-900/50 flex items-center justify-between">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Live Preview
          </h2>
          {uploadedImage && (
            <button 
              className="px-4 py-2 bg-gradient-cyan text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center gap-2"
              onClick={handleDownload}
              disabled={isTransforming}
            >
              {isTransforming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export Image
            </button>
          )}
        </div>
        
        <div className="flex-1 p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-zinc-950/80 flex items-center justify-center relative">
          {!uploadedImage ? (
            <div className="text-center">
              <ImageIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 font-medium">Upload an image to see the preview</p>
            </div>
          ) : (
            <div className="relative max-w-full max-h-full flex items-center justify-center p-4">
              {isTransforming && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm z-10 rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                    <span className="text-sm font-medium text-cyan-400">Applying magic...</span>
                  </div>
                </div>
              )}
              
              <div className="relative shadow-2xl rounded-lg overflow-hidden border border-white/10 ring-1 ring-white/5 transition-all duration-500">
                <img
                  src={getCldImageUrl({
                    src: uploadedImage,
                    width: socialFormats[selectedFormat].width,
                    height: socialFormats[selectedFormat].height,
                    crop: "fill",
                    gravity: "auto",
                  })}
                  alt="transformed image"
                  ref={imageRef as React.RefObject<HTMLImageElement>}
                  onLoad={() => setIsTransforming(false)}
                  className="max-h-[60vh] w-auto object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
