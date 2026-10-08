import { useState, useEffect, useMemo } from 'react';
import { Brain } from 'lucide-react';
import QuizQuestion from './components/QuizQuestion';
import QuizSidebar from './components/QuizSidebar';
import Results from './components/Results';
import quizData from './data/quiz-data.json';
import { QuizData, UserAnswers } from './types/quiz';
import { firstUnansweredQuestion, isAnswered, restoreAnswers } from './utils/answers';
import { calculateLLMScores } from './utils/scoring';

const data: QuizData = quizData;

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>(() => {
    try {
      return restoreAnswers(localStorage.getItem('llm-quiz-answers'), data.questions);
    } catch {
      return {};
    }
  });
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const currentQuestion = data.questions[currentQuestionIndex];
  const totalQuestions = data.questions.length;

  const results = useMemo(() => {
    return calculateLLMScores(data.llms, userAnswers);
  }, [userAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem('llm-quiz-answers', JSON.stringify(userAnswers));
    } catch {
      // Continue the quiz when browser storage is unavailable.
    }
  }, [userAnswers]);

  const handleSelectOption = (optionId: string | string[], questionId?: string) => {
    const qId = questionId ?? currentQuestion.id;
    const newAnswers = {
      ...userAnswers,
      [qId]: optionId,
    };
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!isAnswered(currentQuestion, userAnswers)) return;
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const unansweredIndex = firstUnansweredQuestion(data.questions, userAnswers);
      if (unansweredIndex !== -1) {
        setCurrentQuestionIndex(unansweredIndex);
      } else {
        setShowResults(true);
      }
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
    try {
      localStorage.removeItem('llm-quiz-answers');
    } catch {
      // In-memory answers have already been reset.
    }
  };

  const currentAnswer = userAnswers[currentQuestion?.id];
  const canProceed = isAnswered(currentQuestion, userAnswers);

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center animate-fade-in">
          <div className="mb-8">
            <img
              src={`${import.meta.env.BASE_URL}cmu-logo.png`}
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

          <div className="mt-12 text-center text-sm text-slate-500">
            <p>
              Developed by CMU Privacy Engineering
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden w-full">
          <div className="h-full py-8 px-4 overflow-y-auto lg:overflow-hidden">
            <Results
              results={results}
              onRestart={handleRestart}
              userAnswers={userAnswers}
              onUpdateAnswer={(qId, val) => handleSelectOption(val, qId)}
              allQuestions={data.questions}
            />
          </div>
        </div>

        <div className="shrink-0 py-4 border-t border-slate-200 text-center bg-slate-50/80 backdrop-blur-sm">
          <p className="text-sm text-slate-500">
            Developed by CMU Privacy Engineering
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex overflow-hidden">
      <QuizSidebar
        questions={data.questions}
        currentQuestionIndex={currentQuestionIndex}
        userAnswers={userAnswers}
        onQuestionClick={setCurrentQuestionIndex}
        onRestart={handleRestart}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <Brain className="text-slate-900" size={28} />
                <h1 className="text-2xl font-bold text-slate-900">LLM Selection Guide</h1>
              </div>
            </div>

            <div className="mb-8">
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
          </div>
        </div>

        <div className="shrink-0 py-3 border-t border-slate-200 text-center bg-white/80 backdrop-blur-sm">
          <p className="text-sm text-slate-500">
            Developed by CMU Privacy Engineering
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
