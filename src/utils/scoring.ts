import { LLM, UserAnswers } from '../types/quiz';

export interface ScoredLLM extends LLM {
  totalScore: number;
  matchPercentage: number;
}

export function calculateLLMScores(
  llms: LLM[],
  userAnswers: UserAnswers
): ScoredLLM[] {
  const answerValues = Object.values(userAnswers);

  const scoredLLMs = llms.map((llm) => {
    let totalScore = 0;
    let maxPossibleScore = 0;

    answerValues.forEach((answer) => {
      if (Array.isArray(answer)) {
        // Check if "Not Important" is selected
        const hasNotImportant = answer.some(answerId => answerId.endsWith('-notimportant'));

        if (hasNotImportant) {
          // If "Not Important" is selected, give full score to all models
          totalScore += 10;
          maxPossibleScore += 10;
        } else {
          // Normal scoring for selected options
          answer.forEach((answerId) => {
            const score = llm.scores[answerId] || 0;
            totalScore += score;
            maxPossibleScore += 10;
          });
        }
      } else {
        // Single select
        if (answer.endsWith('-notimportant')) {
          // If "Not Important" is selected, give full score to all models
          totalScore += 10;
          maxPossibleScore += 10;
        } else {
          const score = llm.scores[answer] || 0;
          totalScore += score;
          maxPossibleScore += 10;
        }
      }
    });

    const matchPercentage = maxPossibleScore > 0
      ? (totalScore / maxPossibleScore) * 100
      : 0;

    return {
      ...llm,
      totalScore,
      matchPercentage,
    };
  });

  return scoredLLMs.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

