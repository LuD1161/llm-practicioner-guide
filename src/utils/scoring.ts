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
        // Filter out 'Not Important' options
        const relevantAnswers = answer.filter(answerId => !answerId.endsWith('-notimportant'));

        relevantAnswers.forEach((answerId) => {
          const score = llm.scores[answerId] || 0;
          totalScore += score;
          maxPossibleScore += 10;
        });
      } else {
        // Skip if this is a 'Not Important' answer
        if (!answer.endsWith('-notimportant')) {
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

