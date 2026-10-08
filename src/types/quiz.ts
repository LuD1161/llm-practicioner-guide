export interface Option {
  id: string;
  label: string;
  icon?: string;
  description: string;
}

export interface Question {
  id: string;
  question: string;
  multipleSelect: boolean;
  category?: string;
  options: Option[];
}

export interface PolicyReference {
  feature: string;
  source: string;
  excerpt: string;
  summary?: boolean;
  url: string;
  lastVerified: string;
}

export interface LLM {
  id: string;
  name: string;
  provider: string;
  description: string;
  strengths: string[];
  privacyFeatures?: {
    noTraining?: boolean | string;
    baaAvailable?: boolean | string;
    gdprCompliant?: boolean | string;
    hipaaCompliant?: boolean | string;
    soc2?: boolean | string;
    dataResidency?: string[];
    zeroRetention?: string;
    auditLogs?: boolean | string;
    deletionApi?: boolean | string;
    [key: string]: unknown;
  };
  policyReferences?: PolicyReference[];
  scores: Record<string, number | null>;
}

export interface QuizData {
  questions: Question[];
  llms: LLM[];
}

export interface UserAnswers {
  [questionId: string]: string | string[];
}
