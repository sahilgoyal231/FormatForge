"use client";

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { UploadCloud, FileVideo, X, Loader2 } from 'lucide-react';
import { filesize } from 'filesize';

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleFile = (selectedFile: File) => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File size too large (Max 70MB)");
      return;
    }
    setFile(selectedFile);
    if (!title) {
        // Auto-fill title from filename
        setTitle(selectedFile.name.split('.').slice(0, -1).join('.'));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        handleFile(droppedFile);
      } else {
        toast.error("Please drop a valid video file.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData);
      if(response.status === 200){
        toast.success("Video uploaded successfully");
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload video");
    } finally {
      setIsUploading(false)
    }
  }

  return (
        <div className="max-w-2xl mx-auto mt-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Upload Video</h1>
                <p className="text-zinc-400">Upload a video to compress and optimize it automatically.</p>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Drag and Drop Zone */}
                    <div 
                        className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300
                            ${isDragging 
                                ? 'border-cyan-400 bg-cyan-400/5' 
                                : file 
                                    ? 'border-white/10 bg-white/5' 
                                    : 'border-white/20 hover:border-cyan-500/50 hover:bg-white/5'
                            }
                        `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {!file ? (
                            <>
                                <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                                    <UploadCloud className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1">Drag and drop your video</h3>
                                <p className="text-sm text-zinc-400 mb-6 text-center max-w-xs">
                                    MP4, WebM, or Ogg up to 70MB.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-5 py-2.5 bg-white text-zinc-950 font-medium rounded-xl hover:bg-zinc-200 transition-colors"
                                >
                                    Browse Files
                                </button>
                            </>
                        ) : (
                            <div className="w-full flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-white/10">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                                        <FileVideo className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                        <p className="text-xs text-zinc-400">{filesize(file.size)}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="video/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.[0]) handleFile(e.target.files[0]);
                            }}
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Title <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                                placeholder="Enter a descriptive title"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all resize-none"
                                placeholder="What is this video about?"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-end">
                        <button
                            type="submit"
                            disabled={!file || isUploading || !title}
                            className="px-6 py-3 bg-gradient-cyan text-white font-medium rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    Upload Video
                                    <UploadCloud className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      );
}