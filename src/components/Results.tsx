import { RotateCcw } from 'lucide-react';
import { ScoredLLM } from '../utils/scoring';
import { LLM, Question, UserAnswers } from '../types/quiz';
import ComparisonTable from './ComparisonTable';
import QuestionConfigurator from './QuestionConfigurator';

interface ResultsProps {
  results: ScoredLLM[];
  onRestart: () => void;
  userAnswers: UserAnswers;
  onUpdateAnswer: (questionId: number, value: string | string[]) => void;
  allQuestions: Question[];
  allLLMs: LLM[];
}

export default function Results({
  results,
  onRestart,
  userAnswers,
  onUpdateAnswer,
  allQuestions,
  allLLMs
}: ResultsProps) {
  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Analysis & Recommendations
          </h1>
          <p className="text-slate-600 mt-1">
            Compare models based on your specific privacy and compliance needs
          </p>
        </div>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
        >
          <RotateCcw size={18} />
          Start Over
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Sidebar - Configuration */}
        <div className="lg:col-span-3 h-full overflow-hidden">
          <QuestionConfigurator
            questions={allQuestions}
            userAnswers={userAnswers}
            onUpdateAnswer={onUpdateAnswer}
          />
        </div>

        {/* Main Content - Comparison Table */}
        <div className="lg:col-span-9 h-full overflow-hidden flex flex-col">
          <ComparisonTable
            results={results}
            questions={allQuestions}
            userAnswers={userAnswers}
          />
        </div>
      </div>
    </div>
  );
}

