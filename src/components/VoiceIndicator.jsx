import React from 'react';

const VoiceIndicator = ({ isListening }) => {
  if (!isListening) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-rose-600 p-8 rounded-full shadow-2xl">
           <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </div>
      </div>
      <h2 className="mt-8 text-2xl font-bold text-white tracking-wide">Listening...</h2>
      <p className="text-rose-200 mt-2">Ask a question to generate a new script.</p>
    </div>
  );
};

export default VoiceIndicator;
