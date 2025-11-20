import { useState } from 'react';
import { CheckCircle2, Circle, ChevronLeft, RotateCcw } from 'lucide-react';
import { Question, UserAnswers } from '../types/quiz';

interface QuizSidebarProps {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: UserAnswers;
  onQuestionClick: (index: number) => void;
  onRestart?: () => void;
}

export default function QuizSidebar({
  questions,
  currentQuestionIndex,
  userAnswers,
  onQuestionClick,
  onRestart,
}: QuizSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const answeredCount = Object.keys(userAnswers).length;
  const totalQuestions = questions.length;
  const percentage = (answeredCount / totalQuestions) * 100;

  return (
    <div className={`relative bg-white border-r border-slate-200 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-80'}`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 right-2 z-10 w-8 h-8 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors shadow-sm"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft
          size={16}
          className={`text-slate-700 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
        />
      </button>

      {!isCollapsed && (
        <div className="p-6 overflow-y-auto h-full flex flex-col">
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Progress</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600">
                {answeredCount} of {totalQuestions} answered
              </span>
              <span className="text-xs font-medium text-slate-900">
                {Math.round(percentage)}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Questions</h3>
            <div className="space-y-2">
              {questions.map((question, index) => {
                const isAnswered = userAnswers[question.id] !== undefined;
                const isCurrent = index === currentQuestionIndex;

                return (
                  <button
                    key={question.id}
                    onClick={() => onQuestionClick(index)}
                    className={`
                  w-full text-left p-3 rounded-lg transition-all duration-200
                  ${isCurrent
                        ? 'bg-slate-900 text-white'
                        : isAnswered
                          ? 'bg-slate-50 text-slate-900 hover:bg-slate-100'
                          : 'bg-white text-slate-400 hover:bg-slate-50'
                      }
                `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {isAnswered ? (
                          <CheckCircle2
                            size={16}
                            className={isCurrent ? 'text-white' : 'text-slate-900'}
                            fill="currentColor"
                          />
                        ) : (
                          <Circle
                            size={16}
                            className={isCurrent ? 'text-white' : 'text-slate-300'}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs font-medium ${isCurrent
                              ? 'text-white'
                              : isAnswered
                                ? 'text-slate-600'
                                : 'text-slate-400'
                              }`}
                          >
                            Q{index + 1}
                          </span>
                        </div>
                        <div className="relative group/question">
                          <p
                            className={`text-sm leading-snug truncate cursor-help ${isCurrent
                              ? 'text-white'
                              : isAnswered
                                ? 'text-slate-900'
                                : 'text-slate-400'
                              }`}
                          >
                            {question.question}
                          </p>
                          {/* Tooltip for full question */}
                          <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover/question:opacity-100 group-hover/question:visible transition-all z-50 shadow-xl pointer-events-none">
                            {question.question}
                            <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {onRestart && (
            <div className="mt-auto pt-6 border-t border-slate-200">
              <button
                onClick={onRestart}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
              >
                <RotateCcw size={16} />
                Reset Progress
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
