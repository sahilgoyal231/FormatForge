import Link from "next/link";
import { ArrowRight, Video as VideoIcon, Share2, UploadCloud } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 overflow-hidden relative">
      {/* Background gradients and blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="w-full relative z-10 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8 shrink-0" />
            <span className="font-bold text-xl tracking-tight">FormatForge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="px-4 py-2 text-sm font-medium bg-white text-zinc-950 rounded-full hover:bg-zinc-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-float">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Next-Gen Media Management
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl leading-tight">
          Manage, Transform, and <br className="hidden md:block" />
          <span className="text-gradient-cyan">Share Your Media</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12">
          The ultimate platform for video uploads, intelligent compression, and social media image formatting. Built with power, designed for professionals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-20">
          <Link 
            href="/sign-in" 
            className="group relative px-8 py-4 bg-white text-zinc-950 rounded-full font-semibold text-lg overflow-hidden transition-all hover:scale-105"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-cyan opacity-0 group-hover:opacity-10 transition-opacity" />
            <span className="flex items-center gap-2">
              Start for free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link 
            href="#features" 
            className="px-8 py-4 rounded-full font-semibold text-lg text-zinc-300 border border-white/10 hover:bg-white/5 transition-all"
          >
            View Features
          </Link>
        </div>

        {/* Feature Highlights - Glassmorphic Cards */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {[
            {
              icon: UploadCloud,
              title: "Lightning Fast Uploads",
              desc: "Upload heavy video files with optimized chunking and processing."
            },
            {
              icon: VideoIcon,
              title: "Intelligent Compression",
              desc: "Save bandwidth without losing quality using Cloudinary's AI compression."
            },
            {
              icon: Share2,
              title: "Social Auto-Formatting",
              desc: "Instantly crop and resize images for Instagram, Twitter, and Facebook."
            }
          ].map((feature, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-2xl flex flex-col items-start text-left hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}