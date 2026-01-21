import React from 'react';

const Controls = ({
    isPlaying,
    onTogglePlay,
    onRestart,
    speed,
    onSpeedChange,
    onReset
}) => {
    return (
        <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-800/50 p-4 rounded-2xl backdrop-blur-sm border border-slate-700/50">

            {/* Playback Controls */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onRestart}
                    className="p-3 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Restart"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                </button>

                <button
                    onClick={onTogglePlay}
                    className={`
            p-6 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg
            ${isPlaying
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-900'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }
          `}
                    title={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="4" x2="10" y2="20" /><line x1="14" y1="4" x2="14" y2="20" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    )}
                </button>
            </div>

            <div className="w-px h-10 bg-slate-700 hidden md:block"></div>

            {/* Speed Controls */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Speed</span>
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                    {['slow', 'normal', 'fast'].map((s) => (
                        <button
                            key={s}
                            onClick={() => onSpeedChange(s)}
                            className={`
                px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all
                ${speed === s
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                }
              `}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-px h-10 bg-slate-700 hidden md:block"></div>

            <button 
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-rose-900/30 text-slate-300 hover:text-rose-400 rounded-lg transition-all border border-transparent hover:border-rose-500/30"
                title="Exit Session"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span className="font-medium">Exit</span>
            </button>
        </div>
    );
};

export default Controls;
