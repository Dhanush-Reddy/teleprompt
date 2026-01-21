import React from 'react';

const Settings = ({ mode, onModeChange }) => {
    const modes = [
        { id: 'normal', name: 'Standard', desc: 'Constant pacing based on text length.' },
        { id: 'random', name: 'Human', desc: 'Slight timing variations for realism.' },
        { id: 'chunked', name: 'Dynamic', desc: 'Unpredictable bursts of speed.' },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-4 mt-8">
            {modes.map((m) => (
                <button
                    key={m.id}
                    onClick={() => onModeChange(m.id)}
                    className={`
            group relative p-4 rounded-xl border transition-all duration-300 w-full md:w-64 text-left
            ${mode === m.id
                            ? 'bg-indigo-900/30 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                            : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                        }
          `}
                >
                    <div className="flex items-center gap-3 mb-1">
                        <div className={`w-3 h-3 rounded-full ${mode === m.id ? 'bg-indigo-400' : 'bg-slate-600 group-hover:bg-slate-500'}`}></div>
                        <span className={`font-semibold ${mode === m.id ? 'text-indigo-100' : 'text-slate-300'}`}>
                            {m.name}
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                        {m.desc}
                    </p>
                </button>
            ))}
        </div>
    );
};

export default Settings;
