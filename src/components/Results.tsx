import { Trophy, Award, Medal, CheckCircle2, ArrowRight } from 'lucide-react';
import { ScoredLLM } from '../utils/scoring';

interface ResultsProps {
  results: ScoredLLM[];
  onRestart: () => void;
}

export default function Results({ results, onRestart }: ResultsProps) {
  const topThree = results.slice(0, 3);
  const winner = topThree[0];

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="text-amber-500" size={28} />;
      case 1:
        return <Award className="text-slate-400" size={24} />;
      case 2:
        return <Medal className="text-amber-700" size={24} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-900 rounded-full mb-6">
          <Trophy className="text-amber-400" size={40} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Your Perfect Match
        </h1>
        <p className="text-lg text-slate-600">
          Based on your preferences, here are your top LLM recommendations
        </p>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 mb-8 text-white shadow-2xl">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <Trophy className="text-amber-400" size={48} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold">{winner.name}</h2>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                {winner.provider}
              </span>
            </div>
            <p className="text-slate-200 text-lg mb-4">{winner.description}</p>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Match Score</span>
                <span className="text-2xl font-bold">{Math.round(winner.matchPercentage)}%</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-1000"
                  style={{ width: `${winner.matchPercentage}%` }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-slate-300">Key Strengths</h3>
              <div className="flex flex-wrap gap-2">
                {winner.strengths.map((strength) => (
                  <span
                    key={strength}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-sm"
                  >
                    <CheckCircle2 size={14} />
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-12">
        {topThree.slice(1).map((llm, index) => (
          <div
            key={llm.id}
            className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 pt-1">
                {getRankIcon(index + 1)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{llm.name}</h3>
                  <span className="px-2 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                    {llm.provider}
                  </span>
                </div>
                <p className="text-slate-600 mb-3">{llm.description}</p>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-500">Match Score</span>
                      <span className="text-sm font-bold text-slate-900">
                        {Math.round(llm.matchPercentage)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-400 transition-all duration-1000"
                        style={{ width: `${llm.matchPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {llm.strengths.slice(0, 3).map((strength) => (
                      <span
                        key={strength}
                        className="px-2 py-1 bg-slate-50 rounded text-xs text-slate-600"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg"
        >
          Start Over
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
