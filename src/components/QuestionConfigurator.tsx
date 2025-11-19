import React from 'react';
import { Question, UserAnswers } from '../types/quiz';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionConfiguratorProps {
    questions: Question[];
    userAnswers: UserAnswers;
    onUpdateAnswer: (questionId: number, value: string | string[]) => void;
}

export default function QuestionConfigurator({
    questions,
    userAnswers,
    onUpdateAnswer,
}: QuestionConfiguratorProps) {
    const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);

    // Group questions by category
    const questionsByCategory = questions.reduce((acc, question) => {
        const category = question.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(question);
        return acc;
    }, {} as Record<string, Question[]>);

    const toggleCategory = (category: string) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-semibold text-slate-900">Configure Requirements</h3>
                <p className="text-xs text-slate-500 mt-1">
                    Adjust your answers to see how recommendations change
                </p>
            </div>

            <div className="overflow-y-auto flex-1 p-2">
                {Object.entries(questionsByCategory).map(([category, categoryQuestions]) => (
                    <div key={category} className="mb-2">
                        <button
                            onClick={() => toggleCategory(category)}
                            className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left"
                        >
                            <span className="font-medium text-sm text-slate-700">{category}</span>
                            {expandedCategory === category ? (
                                <ChevronUp size={16} className="text-slate-500" />
                            ) : (
                                <ChevronDown size={16} className="text-slate-500" />
                            )}
                        </button>

                        {expandedCategory === category && (
                            <div className="mt-2 space-y-4 pl-2 pr-1 pb-2">
                                {categoryQuestions.map((question) => (
                                    <div key={question.id} className="text-sm">
                                        <p className="font-medium text-slate-800 mb-2 text-xs">
                                            {question.question}
                                        </p>
                                        <div className="space-y-1">
                                            {question.options.map((option) => {
                                                const isSelected = Array.isArray(userAnswers[question.id])
                                                    ? (userAnswers[question.id] as string[]).includes(option.id)
                                                    : userAnswers[question.id] === option.id;

                                                return (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => {
                                                            if (question.multipleSelect) {
                                                                const current = (userAnswers[question.id] as string[]) || [];
                                                                const newValue = current.includes(option.id)
                                                                    ? current.filter((id) => id !== option.id)
                                                                    : [...current, option.id];
                                                                onUpdateAnswer(question.id, newValue);
                                                            } else {
                                                                onUpdateAnswer(question.id, option.id);
                                                            }
                                                        }}
                                                        className={`
                              w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-left transition-all
                              ${isSelected
                                                                ? 'bg-slate-900 text-white shadow-sm'
                                                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                                                            }
                            `}
                                                    >
                                                        <div className={`
                              w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0
                              ${isSelected ? 'border-white' : 'border-slate-300'}
                            `}>
                                                            {isSelected && <Check size={10} />}
                                                        </div>
                                                        <span className="line-clamp-2">{option.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
