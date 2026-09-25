import React, {useState, useEffect, useCallback} from 'react'
import {getCldImageUrl, getCldVideoUrl} from "next-cloudinary"
import { Download, Clock, FileDown, FileUp, PlayCircle } from "lucide-react";
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"
import {filesize} from "filesize"
import { Video } from '@/types';

dayjs.extend(relativeTime)

interface VideoCardProps {
    video: Video;
    onDownload: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({video, onDownload}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [previewError, setPreviewError] = useState(false)

    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId,
            width: 400,
            height: 225,
            crop: "fill",
            gravity: "auto",
            format: "jpg",
            quality: "auto",
            assetType: "video"
        })
    }, [])

    const getFullVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            rawTransformations: ["q_auto", "f_mp4", "fl_attachment"]
        })
    }, [])

    const getPreviewVideoUrl = useCallback((publicId: string) => {
        return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/e_preview:duration_15:max_seg_9:min_seg_dur_1,f_mp4/${publicId}.mp4`;
    }, [])

    const formatSize = useCallback((size: number) => {
        return filesize(size)
    }, [])

    const formatDuration = useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }, []);

    const isProcessing = Number(video.compressedSize) === Number(video.originalSize);

    const compressionPercentage = Math.round(
        (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreviewError(false);
    }, [isHovered]);

    const handlePreviewError = () => {
        setPreviewError(true);
    };

    return (
        <div
            className="glass-card flex flex-col overflow-hidden group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <figure className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                {isHovered ? (
                    previewError ? (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                            <p className="text-red-400 text-sm">Preview not available</p>
                        </div>
                    ) : (
                        <video
                            src={getPreviewVideoUrl(video.publicId)}
                            autoPlay
                            muted
                            loop
                            className="w-full h-full object-cover transform scale-105 transition-transform duration-700"
                            onError={handlePreviewError}
                        />
                    )
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={getThumbnailUrl(video.publicId)}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent opacity-60" />
                
                {/* Duration Pill */}
                <div className="absolute bottom-3 right-3 bg-zinc-950/60 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-medium text-white flex items-center gap-1 border border-white/10">
                    <Clock size={14} className="text-cyan-400" />
                    {formatDuration(video.duration)}
                </div>

                {/* Play icon overlay on hover */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                    <PlayCircle className="w-12 h-12 text-white/80" />
                </div>
            </figure>
            
            <div className="p-5 flex flex-col flex-1">
                <h2 className="text-lg font-bold text-white mb-1 line-clamp-1">{video.title}</h2>
                <p className="text-sm text-zinc-400 mb-4 line-clamp-2 min-h-10">
                    {video.description || "No description provided."}
                </p>
                
                <div className="mt-auto space-y-4">
                    <div className="flex items-center text-xs text-zinc-500">
                        Uploaded {dayjs(video.createdAt).fromNow()}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm bg-black/20 rounded-xl p-3 border border-white/5">
                        <div className="flex items-start gap-2">
                            <FileUp size={16} className="text-blue-400 mt-0.5" />
                            <div>
                                <div className="text-xs text-zinc-500">Original</div>
                                <div className="font-medium text-zinc-200">{formatSize(Number(video.originalSize))}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <FileDown size={16} className="text-cyan-400 mt-0.5" />
                            <div>
                                <div className="text-xs text-zinc-500">Compressed</div>
                                <div className="font-medium text-zinc-200">
                                    {isProcessing ? (
                                        <span className="text-zinc-400 animate-pulse text-xs">Processing...</span>
                                    ) : (
                                        formatSize(Number(video.compressedSize))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                        <div className="text-sm font-medium text-zinc-400">
                            {isProcessing ? (
                                <span className="text-zinc-400 animate-pulse">Compressing video...</span>
                            ) : (
                                <>Saved <span className="text-cyan-400 font-bold">{compressionPercentage}%</span></>
                            )}
                        </div>
                        <button
                            className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-colors group/btn"
                            onClick={() => onDownload(getFullVideoUrl(video.publicId), video.title)}
                            title="Download full quality"
                        >
                            <Download size={18} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoCard