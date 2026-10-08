import assert from 'node:assert/strict';
import { test } from 'node:test';
import quizData from '../src/data/quiz-data.json';
import { firstUnansweredQuestion, isAnswered, restoreAnswers } from '../src/utils/answers';
import { calculateLLMScores } from '../src/utils/scoring';
import { featureGroups, featureTags } from '../src/utils/features';
import { LLM, QuizData, UserAnswers } from '../src/types/quiz';

const data: QuizData = quizData;
const model: LLM = {
  id: 'test', name: 'Test', provider: 'Test', description: '', strengths: [],
  scores: { supported: 10, unsupported: 0, partial: 5, unknown: null },
};

test('every requirement has a score or an explicit unverified value', () => {
  const ids = data.questions.flatMap(question => question.options.map(option => option.id));
  assert.equal(new Set(ids).size, ids.length);
  for (const llm of data.llms) {
    for (const id of ids.filter(id => !id.endsWith('-notimportant'))) {
      assert.ok(Object.hasOwn(llm.scores, id), `${llm.id}: ${id}`);
      const score = llm.scores[id];
      assert.ok(score === null || (Number.isFinite(score) && score >= 0 && score <= 10));
    }
  }
  assert.deepEqual(featureGroups.flatMap(group => group.options.map(([id]) => id)).sort(), ids.filter(id => !id.endsWith('-notimportant')).sort());
});

test('incomplete and deselected answers cannot complete the quiz', () => {
  const last = data.questions.at(-1)!;
  const answers: UserAnswers = { [last.id]: [last.options[0].id] };
  assert.equal(firstUnansweredQuestion(data.questions, answers), 0);
  const all: UserAnswers = Object.fromEntries(data.questions.map(q => [q.id, q.multipleSelect ? [q.options[0].id] : q.options[0].id]));
  assert.equal(firstUnansweredQuestion(data.questions, all), -1);
  all[data.questions[0].id] = [];
  assert.equal(isAnswered(data.questions[0], all), false);
  assert.equal(firstUnansweredQuestion(data.questions, all), 0);
});

test('corrupt, stale, and differently shaped stored answers are normalized', () => {
  for (const saved of [null, '{bad json', 'null', '[]', '3']) assert.deepEqual(restoreAnswers(saved, data.questions), {});
  const multi = data.questions[0];
  const single = data.questions.find(q => !q.multipleSelect)!;
  const none = multi.options.find(o => o.id.endsWith('-notimportant'))!.id;
  assert.deepEqual(restoreAnswers(JSON.stringify({
    [multi.id]: [multi.options[0].id, none, 'removed-option', null],
    [single.id]: [single.options[0].id, single.options[1].id],
    deletedQuestion: 'old',
  }), data.questions), { [multi.id]: [none], [single.id]: single.options[0].id });
  assert.equal(isAnswered(multi, { [multi.id]: ['removed-option'] }), false);
});

test('scoring distinguishes unverified from zero and awards partial support', () => {
  const [result] = calculateLLMScores([model], { q1: ['supported', 'partial'], q2: 'unknown', q3: 'unsupported' });
  assert.equal(result.matchPercentage, 37.5);
  assert.deepEqual(result.unverifiedOptions, ['unknown']);
  assert.deepEqual(featureTags(model, [['unknown', 'Export']]), ['Unverified']);
  assert.deepEqual(featureTags(model, [['unsupported', 'Export']]), ['No confirmed support']);
  assert.deepEqual(featureTags(model, [['partial', 'EU']]), ['EU (partial)']);
});

test('not-important selections and empty answers preserve defined scoring', () => {
  const [result] = calculateLLMScores([model], { q1: ['supported', 'q1-notimportant'], q2: 'q2-notimportant', q3: [] });
  assert.equal(result.matchPercentage, 100);
  assert.deepEqual(result.unverifiedOptions, []);
  assert.equal(calculateLLMScores([model], {})[0].matchPercentage, 0);
});

test('residency and breach evidence affect recommendations', () => {
  const results = calculateLLMScores(data.llms, { 'data-residency': 'residency-us', 'incident-response': ['incident-breach'] });
  assert.equal(results[0].id, 'openai-api');
  assert.equal(results[0].matchPercentage, 100);
  assert.ok(results.find(llm => llm.id === 'google-gemini')!.matchPercentage < 100);
});
