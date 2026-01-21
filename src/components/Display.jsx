import React, { useEffect, useState } from 'react';

const Display = ({ sentences, currentIndex }) => {
  // We keep track of the previous sentence for the fade-out effect
  const [displayState, setDisplayState] = useState({
    current: sentences[0],
    prev: null,
    key: 0
  });

  useEffect(() => {
    setDisplayState(prev => {
        if (prev.key !== currentIndex) {
             return {
                current: sentences[currentIndex],
                prev: sentences[currentIndex - 1] || null,
                key: currentIndex
              };
        }
        return prev;
    });
  }, [currentIndex, sentences]);

  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center min-h-[40vh] md:min-h-[50vh] relative perspective-1000">
      
      {/* Container for text stability */}
      <div className="relative w-full text-center max-w-5xl mx-auto px-6">
        
        {/* Previous Sentence (Fading out) */}
        {displayState.prev && (
           <div 
             key={`prev-${displayState.key}`}
             className="absolute top-0 left-0 right-0 transform -translate-y-full opacity-0 transition-all duration-700 ease-out select-none pointer-events-none"
             aria-hidden="true"
           >
             <p className="text-2xl md:text-3xl text-slate-600 font-medium leading-relaxed blur-[2px]">
               {displayState.prev}
             </p>
           </div>
        )}

        {/* Current Sentence (Active) */}
        <div key={`curr-${displayState.key}`} className="animate-slide-up">
            <p className="text-4xl md:text-6xl font-bold text-slate-50 leading-tight tracking-tight drop-shadow-2xl">
              {displayState.current}
            </p>
        </div>

         {/* Upcoming indicator (Subtle) */}
         {currentIndex < sentences.length - 1 && (
            <div className="absolute -bottom-16 left-0 right-0 flex justify-center opacity-30">
                 <div className="flex gap-1">
                     <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></span>
                     <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-75"></span>
                     <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-150"></span>
                 </div>
            </div>
         )}
      </div>
      
       <style>{`
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Display;
