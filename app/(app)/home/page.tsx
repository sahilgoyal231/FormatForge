"use client";

import React, {useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import VideoCard from '@/components/VideoCard'
import { Video } from '@/types'
import { Loader2, Video as VideoIcon } from 'lucide-react'

function Home() {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchVideos = useCallback(async () => {
        try {
            const response = await axios.get("/api/videos")
            if(Array.isArray(response.data)) {
                setVideos(response.data)
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.log(error);
            setError("Failed to fetch videos")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchVideos()
    }, [fetchVideos])

    useEffect(() => {
        // Only poll if there are videos that are still processing
        const hasProcessingVideos = videos.some(video => video.originalSize === video.compressedSize);
        if (hasProcessingVideos) {
            const intervalId = setInterval(() => {
                fetchVideos();
            }, 5000);
            return () => clearInterval(intervalId);
        }
    }, [videos, fetchVideos]);

    const handleDownload = useCallback((url: string, title: string) => {
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;
                link.setAttribute("download", `${title}.mp4`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch((error) => console.error("Download failed", error));
    }, [])

    if(loading){
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
                <p className="text-zinc-400 font-medium tracking-wide">Loading your media...</p>
            </div>
        )
    }

    if(error){
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Your Videos</h1>
                    <p className="text-sm text-zinc-400">Manage and download your compressed media.</p>
                </div>
            </div>
          
            {videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[40vh] border border-dashed border-white/10 rounded-2xl bg-zinc-900/30">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                        <VideoIcon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No videos yet</h3>
                    <p className="text-zinc-400 max-w-sm text-center">
                        Upload your first video to see it compressed and ready for download here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {videos.map((video) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            onDownload={handleDownload}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home