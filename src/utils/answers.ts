import { Question, UserAnswers } from '../types/quiz';

export function isAnswered(question: Question, answers: UserAnswers): boolean {
  const answer = answers[question.id];
  const ids = Array.isArray(answer) ? answer : answer ? [answer] : [];
  return ids.length > 0 && ids.every(id => question.options.some(option => option.id === id));
}

export function firstUnansweredQuestion(questions: Question[], answers: UserAnswers): number {
  return questions.findIndex(question => !isAnswered(question, answers));
}

export function restoreAnswers(saved: string | null, questions: Question[]): UserAnswers {
  if (!saved) return {};
  try {
    const parsed: unknown = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const answers: UserAnswers = {};
    for (const question of questions) {
      const value: unknown = (parsed as Record<string, unknown>)[question.id];
      const ids = Array.isArray(value) ? value : [value];
      const valid = [...new Set(ids.filter((id): id is string =>
        typeof id === 'string' && question.options.some(option => option.id === id)
      ))];
      const notImportant = valid.find(id => id.endsWith('-notimportant'));
      if (valid.length > 0) {
        answers[question.id] = question.multipleSelect
          ? notImportant ? [notImportant] : valid
          : valid[0];
      }
    }
    return answers;
  } catch {
    return {};
  }
}
