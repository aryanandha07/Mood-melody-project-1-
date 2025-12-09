import React, { useState, useEffect } from 'react';
import { MoodAnalysisResult, Song } from '../types';
import { Play, RotateCcw, Music2, Share2, Sparkles, X, ExternalLink, SkipBack, SkipForward } from 'lucide-react';

interface ResultsViewProps {
  result: MoodAnalysisResult;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  const [activeSong, setActiveSong] = useState<Song | null>(null);

  // Auto-play the first song when results load
  useEffect(() => {
    if (result.playlist && result.playlist.length > 0) {
      setActiveSong(result.playlist[0]);
    }
  }, [result]);

  const currentIndex = activeSong ? result.playlist.indexOf(activeSong) : -1;

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < result.playlist.length - 1) {
      setActiveSong(result.playlist[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveSong(result.playlist[currentIndex - 1]);
    }
  };

  const getMoodColor = (mood: string) => {
    switch(mood) {
      case 'Happy': case 'Joy': return 'text-yellow-400';
      case 'Sad': case 'Stressed': return 'text-blue-400';
      case 'Angry': case 'Frustrated': return 'text-red-400';
      case 'Romantic': return 'text-pink-400';
      case 'Moody': return 'text-purple-400';
      case 'Proud': return 'text-green-400';
      default: return 'text-white';
    }
  };

  const getEmoji = (mood: string) => {
    switch(mood) {
      case 'Happy': return '😊';
      case 'Sad': return '😢';
      case 'Moody': return '🌩️';
      case 'Romantic': return '🥰';
      case 'Joy': return '🤩';
      case 'Stressed': return '😰';
      case 'Angry': return '😡';
      case 'Frustrated': return '😤';
      case 'Proud': return '🦁';
      default: return '😐';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in pb-36">
       {/* CSS for custom animations */}
       <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes bar-1 { 0%, 100% { height: 4px; } 50% { height: 16px; } }
        @keyframes bar-2 { 0%, 100% { height: 8px; } 50% { height: 20px; } }
        @keyframes bar-3 { 0%, 100% { height: 6px; } 50% { height: 14px; } }
        .animate-music-bar-1 { animation: bar-1 0.8s infinite ease-in-out; }
        .animate-music-bar-2 { animation: bar-2 0.6s infinite ease-in-out; }
        .animate-music-bar-3 { animation: bar-3 1.0s infinite ease-in-out; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
      `}</style>

      {/* Header Section */}
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-800/50 border border-slate-700/50 mb-4 backdrop-blur-xl shadow-xl">
           <span className="text-6xl animate-bounce-slow">{getEmoji(result.detectedMood)}</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          You are feeling <span className={getMoodColor(result.detectedMood)}>{result.detectedMood}</span>
        </h2>
        <p className="text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
          "{result.moodDescription}"
        </p>
      </div>

      {/* Playlist Section */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Music2 className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Curated For You</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Tap to play</p>
                </div>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                <Share2 className="w-5 h-5" />
            </button>
        </div>

        <div className="space-y-3">
          {result.playlist.map((song, index) => (
            <SongCard 
              key={index} 
              song={song} 
              index={index} 
              isPlaying={activeSong?.title === song.title}
              onPlay={() => setActiveSong(song)}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all border border-slate-600 hover:border-slate-500 group"
        >
          <RotateCcw className="w-4 h-4 mr-2 group-hover:-rotate-180 transition-transform duration-500" />
          Analyze Another Mood
        </button>
      </div>

      {/* Sticky Player Overlay */}
      {activeSong && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
           <div className="max-w-5xl mx-auto p-4 flex items-center gap-4 md:gap-6">
              
              {/* Video Embed */}
              <div className="relative w-32 md:w-48 aspect-video rounded-lg overflow-hidden bg-black shadow-lg ring-1 ring-white/10 flex-shrink-0 group">
                 {/* Using YouTube List Type Search Embed with 'official audio' query for better results */}
                 <iframe 
                    src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(activeSong.title + " " + activeSong.artist + " official audio")}&autoplay=1`}
                    className="absolute inset-0 w-full h-full object-cover"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    title="Music Player"
                    frameBorder="0"
                 />
              </div>
              
              {/* Song Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="text-white font-bold truncate text-lg leading-tight mb-1">{activeSong.title}</h3>
                  <p className="text-purple-400 truncate text-sm font-medium">{activeSong.artist}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                     <div className="flex gap-[3px] items-end h-4">
                        <span className="w-1 bg-purple-500 rounded-full animate-music-bar-1"></span>
                        <span className="w-1 bg-purple-500 rounded-full animate-music-bar-2"></span>
                        <span className="w-1 bg-purple-500 rounded-full animate-music-bar-3"></span>
                     </div>
                     <span className="text-xs text-slate-500 font-mono">Playing via YouTube</span>
                  </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                 {/* Prev/Next Navigation */}
                 <div className="flex items-center gap-1 md:gap-2 bg-slate-800/50 rounded-full p-1 border border-slate-700/50">
                    <button 
                      onClick={handlePrev} 
                      disabled={currentIndex <= 0}
                      className="p-2 rounded-full hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      title="Previous Song"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleNext} 
                      disabled={currentIndex === -1 || currentIndex >= result.playlist.length - 1}
                      className="p-2 rounded-full hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      title="Next Song"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>
                 </div>

                 <div className="h-8 w-px bg-slate-700/50 hidden md:block"></div>

                 <a 
                    href={`https://open.spotify.com/search/${encodeURIComponent(activeSong.title + " " + activeSong.artist)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden md:flex items-center justify-center p-3 rounded-full hover:bg-white/10 text-slate-400 hover:text-[#1DB954] transition-all"
                    title="Open in Spotify"
                 >
                    <ExternalLink className="w-5 h-5" />
                 </a>
                 <button 
                    onClick={() => setActiveSong(null)}
                    className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-all ring-1 ring-slate-700"
                    title="Close Player"
                 >
                    <X className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

interface SongCardProps {
  song: Song;
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, index, isPlaying, onPlay }) => (
  <button 
    onClick={onPlay}
    className={`w-full group relative flex items-center p-4 rounded-xl border transition-all duration-300 text-left
      ${isPlaying 
        ? 'bg-purple-600/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
        : 'hover:bg-white/5 border-transparent hover:border-white/10'
      }`}
  >
    {/* Index/Play Icon */}
    <div className="w-8 md:w-12 flex-shrink-0 text-center font-mono text-sm flex justify-center items-center">
      {isPlaying ? (
         <div className="flex gap-[2px] items-end h-4">
            <span className="w-[3px] bg-purple-400 rounded-full animate-music-bar-1"></span>
            <span className="w-[3px] bg-purple-400 rounded-full animate-music-bar-2"></span>
            <span className="w-[3px] bg-purple-400 rounded-full animate-music-bar-3"></span>
         </div>
      ) : (
        <>
          <span className="text-slate-500 group-hover:hidden">{index + 1}</span>
          <Play className="w-4 h-4 hidden group-hover:block text-purple-400 fill-current ml-1" />
        </>
      )}
    </div>

    {/* Song Info */}
    <div className="flex-1 min-w-0 px-4">
      <div className="flex items-baseline justify-between">
          <h4 className={`font-semibold truncate pr-4 text-lg ${isPlaying ? 'text-purple-300' : 'text-white'}`}>
            {song.title}
          </h4>
          <span className="text-xs text-slate-500 font-mono hidden md:block">{song.duration}</span>
      </div>
      <p className="text-slate-400 text-sm truncate">{song.artist}</p>
      <div className="flex items-center mt-1 text-xs text-slate-500">
          <Sparkles className="w-3 h-3 mr-1 text-yellow-500/50" />
          <span className="truncate opacity-80">{song.reason}</span>
      </div>
    </div>
  </button>
);

export default ResultsView;