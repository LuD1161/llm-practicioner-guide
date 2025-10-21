import { X, ExternalLink, FileText, Calendar } from 'lucide-react';
import { PolicyReference } from '../types/quiz';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  llmName: string;
  policyReferences: PolicyReference[];
}

export default function PolicyModal({ isOpen, onClose, llmName, policyReferences }: PolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Privacy & Compliance References</h2>
            <p className="text-slate-300 text-sm">{llmName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-slate-600 mb-6 text-sm">
            The information below is extracted from official Terms of Service and Privacy Policy documents.
            Click the links to view the full source documents.
          </p>

          <div className="space-y-6">
            {policyReferences.map((ref, index) => (
              <div key={index} className="border-2 border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
                {/* Feature Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="text-slate-900" size={20} />
                    <h3 className="font-bold text-slate-900 text-lg">{ref.feature}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar size={14} />
                    <span>Verified {ref.lastVerified}</span>
                  </div>
                </div>

                {/* Source */}
                <div className="mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Source</span>
                  <p className="text-sm text-slate-700 font-medium">{ref.source}</p>
                </div>

                {/* Excerpt */}
                <div className="mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Policy Excerpt</span>
                  <blockquote className="mt-2 pl-4 border-l-4 border-slate-300 text-slate-700 text-sm italic leading-relaxed">
                    "{ref.excerpt}"
                  </blockquote>
                </div>

                {/* Link */}
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <span>View Full Policy</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <p className="text-xs text-slate-500 text-center">
            Note: Policy details may change. Always verify current terms directly with the provider before making decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
