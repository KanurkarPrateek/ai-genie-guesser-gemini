
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GamePhase, Answer, HistoryItem, GeminiResponse } from './types';
import { CATEGORIES, RESPONSE_OPTIONS, MAX_QUESTIONS } from './constants';
import { getAiResponse } from './services/geminiService';
import ProgressBar from './components/ProgressBar';
import ThinkingSpinner from './components/ThinkingSpinner';

const GenieIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.071l9 9a.75.75 0 001.071-1.071l-9-9zM10.33 8.483a.75.75 0 00-1.071-1.071l-5.25 5.25a.75.75 0 000 1.071l5.25 5.25a.75.75 0 101.071-1.071L6.422 13.5l3.908-3.908a.75.75 0 000-1.108z" clipRule="evenodd" />
      <path d="M11.94 13.037a.75.75 0 00-1.071 1.071l3.525 3.525a.75.75 0 101.071-1.071l-3.525-3.525z" />
    </svg>
);


const App: React.FC = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.CATEGORY_SELECT);
  const [category, setCategory] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [topGuess, setTopGuess] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [finalAnswer, setFinalAnswer] = useState<string>('');
  const [reasoning, setReasoning] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const resetGame = () => {
    setGamePhase(GamePhase.CATEGORY_SELECT);
    setCategory('');
    setHistory([]);
    setCurrentQuestion('');
    setCurrentGuess('');
    setTopGuess('');
    setConfidence(0);
    setIsLoading(false);
    setFinalAnswer('');
    setReasoning('');
  };

  const fetchNextAction = useCallback(async (currentHistory: HistoryItem[], currentCategory: string) => {
    setIsLoading(true);
    const response: GeminiResponse = await getAiResponse(currentHistory, currentCategory);
    setIsLoading(false);

    setConfidence(response.confidence);
    setTopGuess(response.topGuess);
    setReasoning(response.reasoning);

    if (response.action === 'ask') {
      setCurrentQuestion(response.payload);
      setHistory(prev => [...prev, { question: response.payload, answer: null }]);
      setGamePhase(GamePhase.ASKING);
    } else if (response.action === 'guess') {
      setCurrentGuess(response.payload);
      setGamePhase(GamePhase.GUESSING);
    }
  }, []);

  useEffect(() => {
    if (gamePhase === GamePhase.ASKING && history.length > 0 && history[history.length - 1].answer !== null) {
      if (history.length >= MAX_QUESTIONS) {
        fetchNextAction(history, category); // Force a guess at max questions
      } else {
        fetchNextAction(history, category);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, gamePhase, category]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading, gamePhase]);

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setGamePhase(GamePhase.ASKING);
    setIsLoading(true);
    // Initial call to get the first question
    fetchNextAction([], selectedCategory);
  };
  
  const handleAnswer = (answer: Answer) => {
    setHistory(prev => {
      const newHistory = [...prev];
      newHistory[newHistory.length - 1].answer = answer;
      return newHistory;
    });
  };

  const handleGuessResponse = (isCorrect: boolean) => {
    if (isCorrect) {
      setGamePhase(GamePhase.WON);
    } else {
        if(history.length >= MAX_QUESTIONS){
            setGamePhase(GamePhase.REVEALING);
        } else {
            setGamePhase(GamePhase.ASKING);
            fetchNextAction(history, category);
        }
    }
  };
  
  const handleFinalAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAnswer.trim()) {
      setGamePhase(GamePhase.LOST);
    }
  };

  const renderGamePhase = () => {
    switch (gamePhase) {
      case GamePhase.CATEGORY_SELECT:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-purple-300 mb-2">Welcome, mortal!</h2>
            <p className="text-slate-300 mb-6">I am the AI Genie. Think of something, and I shall guess it. First, choose a category:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => handleCategorySelect(cat)} className="p-4 bg-slate-700 rounded-lg hover:bg-purple-600 transition-colors duration-200 font-semibold shadow-lg">
                  {cat}
                </button>
              ))}
            </div>
          </div>
        );
      case GamePhase.ASKING:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-purple-300 mb-4 animate-fade-in">{currentQuestion}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {RESPONSE_OPTIONS.map(opt => (
                <button key={opt} onClick={() => handleAnswer(opt)} className="p-3 bg-slate-700 rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case GamePhase.GUESSING:
        return (
          <div className="text-center">
            <h2 className="text-xl text-slate-300 mb-2">My guess is...</h2>
            <p className="text-3xl font-bold text-yellow-300 mb-6 animate-pulse">{currentGuess}</p>
            <p className="text-slate-300 mb-4">Am I correct?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => handleGuessResponse(true)} className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-500 transition-colors duration-200 font-bold shadow-lg">Yes, you got it!</button>
              <button onClick={() => handleGuessResponse(false)} className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-500 transition-colors duration-200 font-bold shadow-lg">No, that's wrong</button>
            </div>
          </div>
        );
      case GamePhase.REVEALING:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-purple-300 mb-2">You have bested me!</h2>
            <p className="text-slate-300 mb-4">What were you thinking of?</p>
            <form onSubmit={handleFinalAnswerSubmit} className="flex flex-col gap-4 items-center">
              <input type="text" value={finalAnswer} onChange={(e) => setFinalAnswer(e.target.value)} className="w-full max-w-sm p-3 bg-slate-800 border-2 border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Type the answer here..."/>
              <button type="submit" className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors duration-200 font-bold shadow-lg">Reveal Answer</button>
            </form>
          </div>
        );
      case GamePhase.WON:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-yellow-300 mb-2">Victory!</h2>
            <p className="text-slate-300 mb-6">I knew it was <span className="font-bold">{currentGuess}</span>! I am the greatest genie!</p>
            <button onClick={resetGame} className="px-6 py-3 bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors duration-200 font-bold shadow-lg">Play Again</button>
          </div>
        );
      case GamePhase.LOST:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-purple-300 mb-2">How clever!</h2>
            <p className="text-slate-300 mb-6">I shall remember <span className="font-bold">{finalAnswer}</span> for our next encounter.</p>
            <button onClick={resetGame} className="px-6 py-3 bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors duration-200 font-bold shadow-lg">Play Again</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            AI Genie Guesser
          </h1>
        </header>

        <main className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-slate-700 min-h-[450px] flex flex-col">
          <div className="flex-grow overflow-y-auto pr-2 max-h-60 mb-4">
              {history.map((item, index) => (
                item.answer && (
                    <div key={index} className="mb-4 text-sm">
                        <p className="text-slate-400"><span className="font-bold text-purple-300">Q:</span> {item.question}</p>
                        <p className="text-slate-200"><span className="font-bold text-cyan-300">A:</span> {item.answer}</p>
                    </div>
                )
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="mt-auto pt-4 border-t border-slate-700">
            <div className="min-h-[150px] flex items-center justify-center">
              {isLoading ? <ThinkingSpinner /> : renderGamePhase()}
            </div>
            
            {gamePhase !== GamePhase.CATEGORY_SELECT && (
                 <div className="mt-6 text-center">
                    <p className="text-sm text-slate-400 mb-1">
                      Genie's Confidence for: <span className="font-bold text-yellow-300">{topGuess || '...'}</span>
                    </p>
                    <ProgressBar progress={confidence} />
                    <p className="text-xs text-slate-500 italic h-4">{reasoning}</p>
                </div>
            )}
          </div>
        </main>
        
        <footer className="text-center mt-6 text-sm text-slate-500">
            <p>Let's play a game.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
