import React, { useState } from 'react';
import Layout from './components/Layout';
import InputArea from './components/InputArea';
import Display from './components/Display';
import Controls from './components/Controls';
import Settings from './components/Settings';
import VoiceIndicator from './components/VoiceIndicator';
import { splitTextToSentences } from './utils/text';
import { useTeleprompter } from './hooks/useTeleprompter';
import { listen } from './services/speech';
import { getAnswer } from './services/ai';

function App() {
  const [sentences, setSentences] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [setupMode, setSetupMode] = useState('normal'); 
  const [playbackSpeed, setPlaybackSpeed] = useState('normal');
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  const {
    currentIndex,
    isPlaying,
    togglePlay,
    restart,
    progress,
    setSentence
  } = useTeleprompter(sentences, {
    speed: playbackSpeed,
    mode: setupMode,
    isPlaying: hasStarted && !isListening && !isProcessingVoice
  });

  const handleStart = (text) => {
    const split = splitTextToSentences(text);
    if (split.length > 0) {
      setSentences(split);
      setHasStarted(true);
    }
  };

  const handleReset = () => {
    setHasStarted(false);
    setSentences([]);
    restart();
  };

  const handleVoiceQuery = async () => {
      if (isPlaying) togglePlay(); // Pause current playback
      setIsListening(true);
      
      try {
          const transcript = await listen();
          setIsListening(false);
          setIsProcessingVoice(true);
          
          const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || localStorage.getItem('openrouter_key');
          
          if (!apiKey) {
            alert("OpenRouter API Key required in .env for Voice Q&A.");
            setIsProcessingVoice(false);
            return;
          }

          const answer = await getAnswer(transcript, apiKey);
          const split = splitTextToSentences(answer);
          
          if (split.length > 0) {
             setSentences(split);
             setSentence(0);
          }

      } catch (error) {
          console.error(error);
          alert("Voice Error: " + error.message);
          setIsListening(false);
      } finally {
          setIsProcessingVoice(false);
      }
  };

  return (
    <Layout>
      <VoiceIndicator isListening={isListening || isProcessingVoice} />
      
      {!hasStarted ? (
        <>
            <InputArea onStart={handleStart} />
            <Settings mode={setupMode} onModeChange={setSetupMode} />
        </>
      ) : (
        <>
           {/* Progress Bar */}
           <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
           </div>

           {/* Fixed Exit Button (Top-Left) */}
           <button 
                onClick={handleReset}
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-slate-900/50 hover:bg-rose-900/80 text-slate-400 hover:text-white rounded-full transition-all border border-slate-700 hover:border-rose-500 backdrop-blur-md group shadow-lg"
                title="Exit Session"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                <span className="font-medium text-sm">Exit</span>
           </button>

          <div className="flex-1 flex flex-col w-full h-full min-h-[60vh] justify-center">
             <Display sentences={sentences} currentIndex={currentIndex} />
          </div>

          <div className="sticky bottom-8 z-40 animate-fade-in-up flex flex-col items-center gap-4">
             {/* Controls */}
            <Controls 
                isPlaying={isPlaying} 
                onTogglePlay={togglePlay} 
                onRestart={restart} 
                speed={playbackSpeed}
                onSpeedChange={setPlaybackSpeed}
            />
            
            {/* Floating Mic Button */}
            <button
                onClick={handleVoiceQuery}
                className="fixed bottom-8 right-8 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-90 border-4 border-slate-900 z-50 group"
                title="Ask a Question"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                 <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Ask Question
                 </span>
            </button>
          </div>
          
           {/* Mode Indicator */}
           <div className="absolute top-4 right-4 text-xs font-mono text-slate-500 uppercase tracking-widest opacity-50">
              Mode: {setupMode}
           </div>
        </>
      )}
    </Layout>
  );
}

export default App;
