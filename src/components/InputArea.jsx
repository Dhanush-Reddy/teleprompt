import React, { useState } from 'react';
import { humanizeText } from '../services/ai';

const InputArea = ({ onStart }) => {
    const [text, setText] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [showAi, setShowAi] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onStart(text);
        }
    };

    const handlePasteDemo = () => {
        const demoText = `Welcome to the live teleprompter training tool. This application is designed to help you practice reading in real-time. Unlike standard teleprompters that scroll continuously, this tool reveals text sentence by sentence. This simulates the natural flow of conversation or live transcription. You must stay alert and ready to read what comes next. Try to maintain a steady rhythm and natural intonation. Good luck with your practice session!`;
        setText(demoText);
    };

    const handleHumanize = async () => {
        const key = import.meta.env.VITE_OPENROUTER_API_KEY || apiKey;
        
        if (!key.trim()) {
            alert("Please enter a valid OpenRouter API Key or configure it in .env");
            return;
        }
        if (!text.trim()) {
             alert("Please enter some text first.");
             return;
        }

        setIsAiLoading(true);
        try {
            const humanized = await humanizeText(text, key);
            setText(humanized);
            setShowAi(false); // Close panel on success
        } catch (error) {
            alert(error.message);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl animate-fade-in relative z-10">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    Live Teleprompter
                </h1>
                <p className="text-slate-400">Master the art of real-time reading.</p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <textarea
                        className="relative w-full h-64 bg-slate-800 text-slate-100 p-6 rounded-xl border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-lg leading-relaxed shadow-xl"
                        placeholder="Paste your script here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    {/* Floating Toggle for AI */}
                    <button
                        type="button"
                        onClick={() => setShowAi(!showAi)}
                        className="absolute top-4 right-4 p-2 bg-slate-700/50 hover:bg-slate-600 rounded-lg text-xs font-medium text-emerald-400 border border-emerald-500/30 backdrop-blur-sm transition-all flex items-center gap-1"
                        title="AI Humanizer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12 2.1 12.1" /><path d="m12 12 4.5-5" /></svg>
                        AI Humanizer
                    </button>
                </div>

                {/* AI Panel */}
                {showAi && (
                    <div className="bg-slate-800/80 p-4 rounded-xl border border-emerald-500/30 backdrop-blur-md animate-fade-in-up">
                        <h3 className="text-emerald-400 font-semibold mb-2 text-sm uppercase tracking-wider">Configure AI (OpenRouter)</h3>
                        <p className="text-xs text-slate-400 mb-3">
                            Uses OpenRouter to access LLMs that add realistic imperfections to your script.
                        </p>
                        
                        {import.meta.env.VITE_OPENROUTER_API_KEY ? (
                           <div className="flex items-center gap-2 mb-2 p-2 bg-emerald-900/30 rounded border border-emerald-500/20 text-emerald-200 text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                              <span>API Key configured in environment</span>
                           </div>
                        ) : (
                           <div className="flex gap-2 mb-2">
                                <input 
                                   type="password" 
                                   placeholder="Paste OpenRouter API Key" 
                                   className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                                   value={apiKey}
                                   onChange={(e) => setApiKey(e.target.value)}
                                />
                           </div>
                        )}

                        <div className="flex justify-end">
                            <button
                            type="button"
                            onClick={handleHumanize}
                            disabled={isAiLoading}
                            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
                            >
                            {isAiLoading ? 'Processing...' : 'Humanize Script'}
                            </button>
                        </div>
                        
                        {!import.meta.env.VITE_OPENROUTER_API_KEY && (
                            <p className="text-[10px] text-slate-500 mt-2">
                                Key is only used locally and never stored.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex justify-between items-center mt-2">
                    <button
                        type="button"
                        onClick={handlePasteDemo}
                        className="text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors"
                    >
                        Use Demo Script
                    </button>

                    <button
                        type="submit"
                        disabled={!text.trim()}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Start Practice
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InputArea;
