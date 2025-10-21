export interface Option {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface Question {
  id: number;
  question: string;
  multipleSelect: boolean;
  options: Option[];
}

export interface LLM {
  id: string;
  name: string;
  provider: string;
  description: string;
  strengths: string[];
  scores: Record<string, number>;
}

export interface QuizData {
  questions: Question[];
  llms: LLM[];
}

export interface UserAnswers {
  [questionId: number]: string | string[];
}
