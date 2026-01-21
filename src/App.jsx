import React, { useState } from 'react';
import Layout from './components/Layout';
import InputArea from './components/InputArea';
import Display from './components/Display';
import Controls from './components/Controls';
import Settings from './components/Settings';
import { splitTextToSentences } from './utils/text';
import { useTeleprompter } from './hooks/useTeleprompter';

function App() {
  const [sentences, setSentences] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [setupMode, setSetupMode] = useState('normal'); // 'normal', 'random', 'chunked'
  const [playbackSpeed, setPlaybackSpeed] = useState('normal'); // 'slow', 'normal', 'fast'

  const {
    currentIndex,
    isPlaying,
    togglePlay,
    restart,
    progress
  } = useTeleprompter(sentences, {
    speed: playbackSpeed,
    mode: setupMode,
    isPlaying: hasStarted // Initially start playing when session starts
  });

  const handleStart = (text) => {
    const split = splitTextToSentences(text);
    if (split.length > 0) {
      setSentences(split);
      setHasStarted(true);
      // useTeleprompter will handle auto-start via its useEffect if we pass isPlaying: true initially or toggle it
    }
  };

  const handleReset = () => {
    setHasStarted(false);
    setSentences([]);
    restart();
  };

  return (
    <Layout>
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

          <div className="flex-1 flex flex-col w-full h-full min-h-[60vh] justify-center">
            <Display sentences={sentences} currentIndex={currentIndex} />
          </div>

          <div className="sticky bottom-8 z-40 animate-fade-in-up">
            <Controls
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              onRestart={restart}
              speed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
              onReset={handleReset}
            />
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
