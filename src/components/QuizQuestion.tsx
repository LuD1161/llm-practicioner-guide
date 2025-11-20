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
      const current = selectedArray;

      // Check if this option is a "Not Important" option
      const isNotImportant = optionId.endsWith('-notimportant');

      let newSelection: string[];

      if (isNotImportant) {
        // If clicking "Not Important"
        if (current.includes(optionId)) {
          // Deselecting "Not Important"
          newSelection = [];
        } else {
          // Selecting "Not Important" - clear all other options
          newSelection = [optionId];
        }
      } else {
        // If clicking a regular option
        if (current.includes(optionId)) {
          // Deselecting
          newSelection = current.filter(id => id !== optionId);
        } else {
          // Selecting - remove "Not Important" if present and add this option
          newSelection = [...current.filter(id => !id.endsWith('-notimportant')), optionId];
        }
      }

      onSelectOption(newSelection);
    } else {
      // Allow unselecting even for single select
      if (isSelected(optionId)) {
        onSelectOption([]); // Clear selection
      } else {
        onSelectOption(optionId);
      }
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
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h2 className="text-3xl font-bold text-slate-900">
            {question.question}
          </h2>
        </div>

        {isMultiple && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            <Info size={16} className="flex-shrink-0" />
            <p className="text-sm font-medium">You can select multiple options</p>
          </div>
        )}
      </div>

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
    </div>
  );
}
