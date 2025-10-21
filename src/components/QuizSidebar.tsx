import { useState } from 'react';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Question, UserAnswers } from '../types/quiz';

interface QuizSidebarProps {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: UserAnswers;
  onQuestionClick: (index: number) => void;
}

export default function QuizSidebar({
  questions,
  currentQuestionIndex,
  userAnswers,
  onQuestionClick,
}: QuizSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const answeredCount = Object.keys(userAnswers).length;
  const totalQuestions = questions.length;
  const percentage = (answeredCount / totalQuestions) * 100;

  return (
    <div className={`relative bg-white border-r border-slate-200 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-80'}`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 -right-3 z-10 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight size={14} className="text-slate-600" />
        ) : (
          <ChevronLeft size={14} className="text-slate-600" />
        )}
      </button>

      <div className={`p-6 ${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
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
                        className={`text-xs font-medium ${
                          isCurrent
                            ? 'text-white'
                            : isAnswered
                            ? 'text-slate-600'
                            : 'text-slate-400'
                        }`}
                      >
                        Q{index + 1}
                      </span>
                    </div>
                    <p
                      className={`text-sm leading-snug ${
                        isCurrent
                          ? 'text-white'
                          : isAnswered
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {question.text}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}
