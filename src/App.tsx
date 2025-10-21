import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import QuizQuestion from './components/QuizQuestion';
import ProgressBar from './components/ProgressBar';
import Results from './components/Results';
import quizData from './data/quiz-data.json';
import { QuizData, UserAnswers } from './types/quiz';
import { calculateLLMScores, ScoredLLM } from './utils/scoring';

const data = quizData as QuizData;

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>(() => {
    const saved = localStorage.getItem('llm-quiz-answers');
    return saved ? JSON.parse(saved) : {};
  });
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<ScoredLLM[]>([]);
  const [isStarted, setIsStarted] = useState(false);

  const currentQuestion = data.questions[currentQuestionIndex];
  const totalQuestions = data.questions.length;

  useEffect(() => {
    localStorage.setItem('llm-quiz-answers', JSON.stringify(userAnswers));
  }, [userAnswers]);

  const handleSelectOption = (optionId: string | string[]) => {
    const newAnswers = {
      ...userAnswers,
      [currentQuestion.id]: optionId,
    };
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const calculatedResults = calculateLLMScores(data.llms, userAnswers);
      setResults(calculatedResults);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setIsStarted(false);
    localStorage.removeItem('llm-quiz-answers');
  };

  const currentAnswer = userAnswers[currentQuestion?.id];
  const canProceed = currentAnswer !== undefined &&
    (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true);

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center animate-fade-in">
          <div className="mb-8">
            <img
              src="https://cf-store.widencdn.net/cmu/4/6/a/46ac8372-3330-4644-9c60-c7b77833fe55.png?response-content-disposition=attachment%3B%20filename%3D%22cmu-wordmark-stacked-r.png%22&response-content-type=image%2Fpng&Expires=1761027913&Signature=fFeb-2btmEs8Ievg88WVRijp9AXQizj6xPCMKrUD29IsRHuXdDZXBZkhJGs2oJpx0HEB4YqcFas9hO~rkyA9kv8dpAR~ba13kyP5fXUILI4LX-v6dWXtAt1vflx4ywkdWXmZMkbNXpdQdt3Ej~bC29IP3R-J63AOTNsXya-R4mHtxjpx1fab5Sstn7vwLFtyRQuUgiy2-Tjxy3TimoFH4fK0DHnv33dc7fhsmWDKGaneYCLBO8~3VPKcDHPE7wW2gaPNOXMXlT7-HDSzWLWFf0swsvQhueRaktwoCI9P6DoNHSOWVe~~EimEA~tNiWhAxO7sKKtwuU6-wK-WmareeA__&Key-Pair-Id=APKAJD5XONOBVWWOA65A"
              alt="Carnegie Mellon University"
              className="h-20 mx-auto"
            />
          </div>

          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            LLM Selection Guide
          </h1>

          <p className="text-xl text-slate-600 mb-12 leading-relaxed">
            Find the perfect Large Language Model for your needs. Answer {totalQuestions} quick questions
            and get personalized recommendations based on your requirements.
          </p>

          <button
            onClick={() => setIsStarted(true)}
            className="px-10 py-5 bg-slate-900 text-white text-lg font-semibold rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Get Started
          </button>

          <div className="mt-16 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Developed by CMU Privacy Engineering
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <Results results={results} onRestart={handleRestart} />

        <div className="mt-16 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            Developed by CMU Privacy Engineering
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <Brain className="text-slate-900" size={32} />
            <h1 className="text-2xl font-bold text-slate-900">LLM Selection Guide</h1>
          </div>
        </div>

        <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />

        <div className="mb-12">
          <QuizQuestion
            question={currentQuestion}
            selectedOptions={currentAnswer || null}
            onSelectOption={handleSelectOption}
          />
        </div>

        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all
              ${currentQuestionIndex === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-white text-slate-900 border-2 border-slate-300 hover:border-slate-900'
              }
            `}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`
              px-8 py-3 rounded-lg font-semibold transition-all
              ${!canProceed
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl'
              }
            `}
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'See Results' : 'Next'}
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            Developed by CMU Privacy Engineering
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
