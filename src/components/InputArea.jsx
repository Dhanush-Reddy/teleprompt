import React, { useState, useEffect } from 'react';
import { humanizeText, getAnswer } from '../services/ai';
import { listen } from '../services/speech';
import { extractTextFromPdf } from '../services/pdf';
import VoiceIndicator from './VoiceIndicator';

const InputArea = ({ onStart }) => {
    const [text, setText] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [showAi, setShowAi] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isProcessingVoice, setIsProcessingVoice] = useState(false);
    const [resumeContext, setResumeContext] = useState('');
    const [resumeName, setResumeName] = useState('');

    useEffect(() => {
        // Load saved resume from storage
        const savedResume = localStorage.getItem('user_resume_context');
        const savedName = localStorage.getItem('user_resume_name');
        if (savedResume) setResumeContext(savedResume);
        if (savedName) setResumeName(savedName);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onStart(text);
        }
    };

    const handlePasteDemo = () => {
        const demoText = `Welcome to the live teleprompter training tool. I am a Senior Python Engineer with extensive experience in AWS Cloud architecture. I specialize in building serverless microservices using Lambda, API Gateway, and DynamoDB. My goal is to master communicating complex technical concepts efficiently.`;
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
            setShowAi(false);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleVoiceAsk = async () => {
        const key = import.meta.env.VITE_OPENROUTER_API_KEY || apiKey;
        if (!key.trim()) {
            alert("OpenRouter API Key required in .env for Voice Q&A.");
            return;
        }

        setIsListening(true);
        try {
            const transcript = await listen();
            setIsListening(false);
            setIsProcessingVoice(true);

            // Pass the resume context to the AI
            const answer = await getAnswer(transcript, key, resumeContext);
            setText(answer);
        } catch (error) {
            console.error(error);
            alert("Voice Error: " + error.message);
            setIsListening(false);
        } finally {
            setIsProcessingVoice(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert("Please upload a PDF file.");
            return;
        }

        try {
            const extractedText = await extractTextFromPdf(file);
            setResumeContext(extractedText);
            setResumeName(file.name);
            localStorage.setItem('user_resume_context', extractedText);
            localStorage.setItem('user_resume_name', file.name);
            alert("Resume loaded! The AI is now an expert on YOUR background.");
        } catch (error) {
            alert("Failed to parse PDF: " + error.message);
        }
    };

    return (
        <div className="w-full max-w-2xl animate-fade-in relative z-10">
            <VoiceIndicator isListening={isListening || isProcessingVoice} />

            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    Live Teleprompter
                </h1>
                <p className="text-slate-400">Master the art of real-time reading.</p>

                {/* Resume Status Badge */}
                {resumeName && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-indigo-900/30 border border-indigo-500/30 rounded-full text-xs text-indigo-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                        Expert Context: {resumeName}
                        <button
                            onClick={() => {
                                localStorage.removeItem('user_resume_context');
                                localStorage.removeItem('user_resume_name');
                                setResumeContext('');
                                setResumeName('');
                            }}
                            className="ml-2 hover:text-white"
                            title="Remove Resume"
                        >
                            &times;
                        </button>
                    </div>
                )}
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <textarea
                        className="relative w-full h-64 bg-slate-800 text-slate-100 p-6 rounded-xl border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-lg leading-relaxed shadow-xl"
                        placeholder={resumeContext
                            ? "Ask a question about your experience (e.g., 'Tell me about my serverless project')..."
                            : "Paste your script here... or upload a resume to ask about your background."
                        }
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    {/* Controls Overlay */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        {/* Upload Resume Button */}
                        <label
                            className="p-2 bg-slate-700/50 hover:bg-slate-600 rounded-lg text-xs font-medium text-emerald-400 border border-emerald-500/30 backdrop-blur-sm transition-all flex items-center gap-1 cursor-pointer"
                            title="Upload Resume (PDF)"
                        >
                            <input
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        </label>

                        {/* Mic Button */}
                        <button
                            type="button"
                            onClick={handleVoiceAsk}
                            className="p-2 bg-slate-700/50 hover:bg-slate-600 rounded-lg text-xs font-medium text-emerald-400 border border-emerald-500/30 backdrop-blur-sm transition-all flex items-center gap-1 group"
                            title="Ask AI via Voice"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                        </button>

                        {/* AI Humanizer Toggle */}
                        <button
                            type="button"
                            onClick={() => setShowAi(!showAi)}
                            className="p-2 bg-slate-700/50 hover:bg-slate-600 rounded-lg text-xs font-medium text-emerald-400 border border-emerald-500/30 backdrop-blur-sm transition-all flex items-center gap-1"
                            title="AI Humanizer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12 2.1 12.1" /><path d="m12 12 4.5-5" /></svg>
                            Humanizer
                        </button>
                    </div>
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
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
                )} { /* Closing brace for showAi logic */}

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
