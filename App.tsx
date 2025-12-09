import React, { useState } from 'react';
import { AppState, MoodAnalysisResult, UserPreferences } from './types';
import WebcamCapture from './components/WebcamCapture';
import ResultsView from './components/ResultsView';
import PreferencesView from './components/PreferencesView';
import { analyzeMoodAndGetPlaylist } from './services/gemini';
import { Music, Mic2, Sparkles, BrainCircuit } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>('intro');
  const [analysisResult, setAnalysisResult] = useState<MoodAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({ region: 'Western', genreOrLanguage: 'Pop' });

  const handleCapture = async (imageSrc: string) => {
    setAppState('analyzing');
    setErrorMsg('');
    
    try {
      const result = await analyzeMoodAndGetPlaylist(imageSrc, userPreferences);
      setAnalysisResult(result);
      setAppState('results');
    } catch (err) {
      console.error(err);
      setErrorMsg("We couldn't read your mood. Maybe it's too dark? Try again!");
      setAppState('error');
    }
  };

  const handlePreferencesSubmit = (prefs: UserPreferences) => {
    setUserPreferences(prefs);
    setAppState('camera');
  };

  const renderContent = () => {
    switch (appState) {
      case 'intro':
        return (
          <div className="flex flex-col items-center justify-center max-w-3xl mx-auto text-center space-y-8 animate-fade-in-up">
             <div className="relative mb-8 group cursor-default">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-slate-900 ring-1 ring-slate-900/5 rounded-full p-6">
                   <Music className="w-16 h-16 text-purple-400" />
                </div>
             </div>
             
             <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-purple-100 to-slate-500 pb-2">
               MoodMelody AI
             </h1>
             
             <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
               Your face tells a story. We soundtrack it. <br/>
               Using advanced computer vision, we detect your emotional state and curate the perfect playlist for right now.
             </p>

             <div className="flex flex-col sm:flex-row gap-4 pt-8">
               <button 
                  onClick={() => setAppState('preferences')}
                  className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-purple-50 transition-colors shadow-lg shadow-white/10 flex items-center justify-center"
               >
                 <Mic2 className="w-5 h-5 mr-2" />
                 Start Listening
               </button>
               <div className="flex items-center justify-center px-8 py-4 rounded-full border border-slate-700 text-slate-400 text-sm">
                  <BrainCircuit className="w-4 h-4 mr-2 text-purple-500" />
                  Powered by Gemini 2.5 Flash
               </div>
             </div>
          </div>
        );

      case 'preferences':
        return (
          <PreferencesView 
            onSubmit={handlePreferencesSubmit} 
            onBack={() => setAppState('intro')}
          />
        );

      case 'camera':
        return (
          <WebcamCapture 
            onCapture={handleCapture} 
            onCancel={() => setAppState('preferences')} 
          />
        );

      case 'analyzing':
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-6 animate-pulse">
            <div className="w-24 h-24 relative">
               <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
               <div className="absolute inset-0 rounded-full border-t-4 border-purple-500 animate-spin"></div>
               <Sparkles className="absolute inset-0 m-auto text-purple-400 w-8 h-8 animate-bounce" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Analyzing your vibe...</h2>
            <p className="text-slate-400">Curating the best {userPreferences.genreOrLanguage} tracks</p>
          </div>
        );

      case 'results':
        return analysisResult ? (
          <ResultsView result={analysisResult} onReset={() => setAppState('preferences')} />
        ) : null;

      case 'error':
        return (
          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="text-6xl">😕</div>
            <h3 className="text-2xl font-bold text-red-400">Oops!</h3>
            <p className="text-slate-300">{errorMsg}</p>
            <button 
              onClick={() => setAppState('camera')}
              className="px-6 py-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100">
      
      {/* Navbar/Header */}
      <nav className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-2 font-bold text-xl tracking-tighter cursor-pointer" onClick={() => setAppState('intro')}>
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>MoodMelody</span>
        </div>
        <div className="text-xs font-mono text-slate-600">v1.1.0</div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8 flex flex-col items-center min-h-[80vh] justify-center">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-slate-600 text-sm">
        <p>© 2024 MoodMelody AI. All vibes reserved.</p>
      </footer>

      {/* CSS Animation Utility */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-fade-in {
            animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}