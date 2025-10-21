import { useState, useEffect, useCallback } from 'react';
import { Question } from '../types/quiz';
import OptionCard from './OptionCard';
import { Info } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  selectedOptions: string | string[] | null;
  onSelectOption: (optionId: string | string[]) => void;
}

export default function QuizQuestion({ question, selectedOptions, onSelectOption }: QuizQuestionProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const isMultiple = question.multipleSelect;
  const selectedArray = Array.isArray(selectedOptions) ? selectedOptions : selectedOptions ? [selectedOptions] : [];

  const isSelected = useCallback((optionId: string) => {
    return selectedArray.includes(optionId);
  }, [selectedArray]);

  const handleSelect = useCallback((optionId: string) => {
    if (isMultiple) {
      const newSelection = isSelected(optionId)
        ? selectedArray.filter(id => id !== optionId)
        : [...selectedArray, optionId];
      onSelectOption(newSelection);
    } else {
      onSelectOption(optionId);
    }
  }, [isMultiple, isSelected, selectedArray, onSelectOption]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, optionId: string, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(optionId);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % question.options.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + question.options.length) % question.options.length);
    }
  }, [question.options.length, handleSelect]);

  useEffect(() => {
    const focusedButton = document.querySelector(`[data-option-index="${focusedIndex}"]`) as HTMLElement;
    if (focusedButton) {
      focusedButton.focus();
    }
  }, [focusedIndex]);

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
        {question.question}
      </h2>

      {isMultiple && (
        <div className="flex items-center justify-center gap-2 mb-8 text-slate-600">
          <Info size={16} />
          <p className="text-sm">You can select multiple options</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {question.options.map((option, index) => (
          <div key={option.id} data-option-index={index}>
            <OptionCard
              icon={option.icon}
              label={option.label}
              description={option.description}
              selected={isSelected(option.id)}
              onClick={() => handleSelect(option.id)}
              onKeyDown={(e) => handleKeyDown(e, option.id, index)}
              tabIndex={index === focusedIndex ? 0 : -1}
              isFocused={index === focusedIndex}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-slate-500">
        Use arrow keys to navigate, Space or Enter to select
      </div>
    </div>
  );
}
