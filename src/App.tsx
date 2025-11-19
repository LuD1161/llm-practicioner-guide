import { useState, useEffect, useMemo } from 'react';
import { Brain } from 'lucide-react';
import QuizQuestion from './components/QuizQuestion';
import QuizSidebar from './components/QuizSidebar';
import Results from './components/Results';
import quizData from './data/quiz-data.json';
import { QuizData, UserAnswers } from './types/quiz';
import { calculateLLMScores } from './utils/scoring';

const data = quizData as QuizData;

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>(() => {
    const saved = localStorage.getItem('llm-quiz-answers');
    return saved ? JSON.parse(saved) : {};
  });
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const currentQuestion = data.questions[currentQuestionIndex];
  const totalQuestions = data.questions.length;

  const results = useMemo(() => {
    return calculateLLMScores(data.llms, userAnswers);
  }, [userAnswers]);

  useEffect(() => {
    localStorage.setItem('llm-quiz-answers', JSON.stringify(userAnswers));
  }, [userAnswers]);

  const handleSelectOption = (optionId: string | string[], questionId?: number) => {
    const qId = questionId ?? currentQuestion.id;
    const newAnswers = {
      ...userAnswers,
      [qId]: optionId,
    };
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
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
              src="/cmu-logo.png"
              alt="Carnegie Mellon University"
              className="h-20 mx-auto"
            />
          </div>

          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            LLM Selection Guide
          </h1>

          <p className="text-xl text-slate-600 mb-12 leading-relaxed">
            Find the perfect Large Language Model for your needs.
            <br />Answer quick questions and get personalized recommendations based on your requirements.
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <Results
          results={results}
          onRestart={handleRestart}
          userAnswers={userAnswers}
          onUpdateAnswer={(qId, val) => handleSelectOption(val, qId)}
          allQuestions={data.questions}
          allLLMs={data.llms}
        />

        <div className="mt-8 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            Developed by CMU Privacy Engineering
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <QuizSidebar
        questions={data.questions}
        currentQuestionIndex={currentQuestionIndex}
        userAnswers={userAnswers}
        onQuestionClick={setCurrentQuestionIndex}
      />

      <div className="flex-1 py-8 px-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <Brain className="text-slate-900" size={32} />
              <h1 className="text-2xl font-bold text-slate-900">LLM Selection Guide</h1>
            </div>
          </div>

          <div className="mb-12">
            <QuizQuestion
              question={currentQuestion}
              selectedOptions={currentAnswer || null}
              onSelectOption={handleSelectOption}
            />
          </div>

          <div className="flex items-center justify-between">
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
    </div>
  );
}

export default App;
