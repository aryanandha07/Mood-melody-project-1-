import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { Globe2, Music2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PreferencesViewProps {
  onSubmit: (prefs: UserPreferences) => void;
  onBack: () => void;
}

const REGIONS = [
  { id: 'Indian', label: 'Indian', icon: '🇮🇳' },
  { id: 'Western', label: 'Western', icon: '🌎' },
  { id: 'K-Pop', label: 'K-Pop', icon: '🇰🇷' },
  { id: 'Global Pop', label: 'Global Pop', icon: '🎵' }
];

const SUB_OPTIONS: Record<string, string[]> = {
  'Indian': ['Malayalam', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Punjabi', 'Bollywood'],
  'Western': ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'Indie', 'Alternative'],
  'K-Pop': ['Boy Groups', 'Girl Groups', 'OST', 'Upbeat', 'Ballads'],
  'Global Pop': ['Top 40', 'Viral Hits', 'Dance', 'Latin', 'Afrobeats']
};

const PreferencesView: React.FC<PreferencesViewProps> = ({ onSubmit, onBack }) => {
  const [region, setRegion] = useState<string>('');
  const [subOption, setSubOption] = useState<string>('');

  const handleRegionSelect = (r: string) => {
    setRegion(r);
    setSubOption(''); // Reset sub-option when region changes
  };

  const handleNext = () => {
    if (region && subOption) {
      onSubmit({ region, genreOrLanguage: subOption });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">What's your vibe?</h2>
        <p className="text-slate-400">Help us tune the algorithm to your taste.</p>
      </div>

      <div className="space-y-8">
        {/* Step 1: Region */}
        <div className="space-y-4">
          <label className="flex items-center text-sm font-medium text-purple-300 uppercase tracking-wider">
            <Globe2 className="w-4 h-4 mr-2" />
            Select Region / Style
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => handleRegionSelect(r.id)}
                className={`relative p-4 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 group
                  ${region === r.id 
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-500 hover:text-white'
                  }`}
              >
                <span className="text-2xl filter drop-shadow-lg group-hover:scale-110 transition-transform">{r.icon}</span>
                <span className="font-medium">{r.label}</span>
                {region === r.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Specifics */}
        <div className={`space-y-4 transition-all duration-500 ${region ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
          <label className="flex items-center text-sm font-medium text-purple-300 uppercase tracking-wider">
            <Music2 className="w-4 h-4 mr-2" />
            Specific Language or Genre
          </label>
          
          <div className="flex flex-wrap gap-3">
            {region && SUB_OPTIONS[region]?.map((opt) => (
              <button
                key={opt}
                onClick={() => setSubOption(opt)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
                  ${subOption === opt
                    ? 'bg-white text-slate-900 border-white scale-105 shadow-lg'
                    : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-8 border-t border-slate-800">
           <button
             onClick={onBack}
             className="text-slate-500 hover:text-white transition-colors px-4 py-2"
           >
             Back
           </button>
           <button
             onClick={handleNext}
             disabled={!region || !subOption}
             className="group flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
           >
             Continue
             <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesView;