import { useState } from 'react';
import { ScoredLLM } from '../utils/scoring';
import { LLM, Question } from '../types/quiz';
import { Plus, X, Check, Minus, Download, FileText, Shield, AlertTriangle } from 'lucide-react';
import PolicyModal from './PolicyModal';

interface ComparisonTableProps {
    results: ScoredLLM[];
    allLLMs: LLM[];
    questions: Question[];
}

export default function ComparisonTable({ results, allLLMs, questions }: ComparisonTableProps) {
    // Initialize with top 3 models
    const [selectedModelIds, setSelectedModelIds] = useState<string[]>(() =>
        results.slice(0, 3).map(r => r.id)
    );
    const [showAddModal, setShowAddModal] = useState(false);
    const [viewPolicyModel, setViewPolicyModel] = useState<ScoredLLM | null>(null);

    const selectedModels = selectedModelIds
        .map(id => results.find(r => r.id === id))
        .filter((m): m is ScoredLLM => !!m);

    const availableModels = results.filter(r => !selectedModelIds.includes(r.id));

    const handleAddModel = (id: string) => {
        if (selectedModelIds.length < 4) {
            setSelectedModelIds([...selectedModelIds, id]);
            setShowAddModal(false);
        }
    };

    const handleRemoveModel = (id: string) => {
        setSelectedModelIds(selectedModelIds.filter(mid => mid !== id));
    };

    const handleExport = () => {
        window.print();
    };

    // Helper to get privacy feature value safely
    const getPrivacyFeature = (model: ScoredLLM, key: string) => {
        // @ts-ignore - dynamic access to privacyFeatures
        const val = model.privacyFeatures?.[key];
        if (val === true) return <Check size={16} className="text-emerald-500 mx-auto" />;
        if (val === false) return <X size={16} className="text-rose-500 mx-auto" />;
        return <span className="text-sm text-slate-600">{val}</span>;
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">Model Comparison</h2>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                    <Download size={16} />
                    Export Report
                </button>
            </div>

            <div className="flex-1 overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
                <table className="w-full min-w-[800px] border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 text-left bg-slate-50 border-b border-r border-slate-200 w-48 sticky left-0 z-10">
                                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Features</span>
                            </th>
                            {selectedModels.map((model) => (
                                <th key={model.id} className="p-4 border-b border-r border-slate-200 w-64 min-w-[200px] relative group">
                                    <div className="flex flex-col items-center text-center">
                                        <button
                                            onClick={() => handleRemoveModel(model.id)}
                                            className="absolute top-2 right-2 p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remove model"
                                        >
                                            <X size={16} />
                                        </button>
                                        <h3 className="font-bold text-slate-900 text-lg">{model.name}</h3>
                                        <span className="text-xs text-slate-500 mb-2">{model.provider}</span>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="text-2xl font-bold text-slate-900">{Math.round(model.matchPercentage)}%</div>
                                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Match</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-slate-900"
                                                style={{ width: `${model.matchPercentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </th>
                            ))}
                            {selectedModelIds.length < 4 && (
                                <th className="p-4 border-b border-slate-200 w-64 min-w-[200px] bg-slate-50/50">
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="w-full h-full min-h-[120px] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 hover:border-slate-400 hover:text-slate-500 transition-colors"
                                    >
                                        <Plus size={24} />
                                        <span className="text-sm font-medium">Add Model</span>
                                    </button>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {/* Privacy & Compliance Section */}
                        <tr className="bg-slate-50/50">
                            <td colSpan={selectedModels.length + 2} className="p-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0">
                                Privacy & Compliance
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">No Training on Data</td>
                            {selectedModels.map(m => (
                                <td key={m.id} className="p-4 text-center border-r border-slate-200">
                                    {getPrivacyFeature(m, 'noTraining')}
                                </td>
                            ))}
                            {selectedModelIds.length < 4 && <td />}
                        </tr>
                        <tr>
                            <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">GDPR Compliant</td>
                            {selectedModels.map(m => (
                                <td key={m.id} className="p-4 text-center border-r border-slate-200">
                                    {getPrivacyFeature(m, 'gdprCompliant')}
                                </td>
                            ))}
                            {selectedModelIds.length < 4 && <td />}
                        </tr>
                        <tr>
                            <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">SOC 2 Certified</td>
                            {selectedModels.map(m => (
                                <td key={m.id} className="p-4 text-center border-r border-slate-200">
                                    {getPrivacyFeature(m, 'soc2')}
                                </td>
                            ))}
                            {selectedModelIds.length < 4 && <td />}
                        </tr>
                        <tr>
                            <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">Data Residency</td>
                            {selectedModels.map(m => (
                                <td key={m.id} className="p-4 text-center border-r border-slate-200">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {/* @ts-ignore */}
                                        {m.privacyFeatures?.dataResidency?.map((r: string) => (
                                            <span key={r} className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{r}</span>
                                        ))}
                                    </div>
                                </td>
                            ))}
                            {selectedModelIds.length < 4 && <td />}
                        </tr>

                        {/* Strengths Section */}
                        <tr className="bg-slate-50/50">
                            <td colSpan={selectedModels.length + 2} className="p-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0">
                                Key Strengths
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">Highlights</td>
                            {selectedModels.map(m => (
                                <td key={m.id} className="p-4 border-r border-slate-200 align-top">
                                    <ul className="space-y-1">
                                        {m.strengths.map(s => (
                                            <li key={s} className="text-xs text-slate-600 flex items-start gap-1.5">
                                                <Check size={12} className="mt-0.5 text-emerald-500 flex-shrink-0" />
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            ))}
                            {selectedModelIds.length < 4 && <td />}
                        </tr>

                        {/* Policy Section */}
                        <tr className="bg-slate-50/50">
                            <td colSpan={selectedModels.length + 2} className="p-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0">
                                Documentation
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">Policy References</td>
                            {selectedModels.map(m => (
                                <td key={m.id} className="p-4 text-center border-r border-slate-200">
                                    {m.policyReferences && m.policyReferences.length > 0 ? (
                                        <button
                                            onClick={() => setViewPolicyModel(m)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium text-slate-700 transition-colors"
                                        >
                                            <FileText size={12} />
                                            View Details
                                        </button>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No references</span>
                                    )}
                                </td>
                            ))}
                            {selectedModelIds.length < 4 && <td />}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Add Model Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Add Model to Compare</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-2 max-h-[60vh] overflow-y-auto">
                            {availableModels.length > 0 ? (
                                availableModels.map(model => (
                                    <button
                                        key={model.id}
                                        onClick={() => handleAddModel(model.id)}
                                        className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-white group-hover:shadow-sm">
                                            {Math.round(model.matchPercentage)}%
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{model.name}</div>
                                            <div className="text-xs text-slate-500">{model.provider}</div>
                                        </div>
                                        <Plus size={16} className="ml-auto text-slate-400 group-hover:text-slate-900" />
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-500">
                                    No more models to add
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Policy Modal */}
            {viewPolicyModel && viewPolicyModel.policyReferences && (
                <PolicyModal
                    isOpen={true}
                    onClose={() => setViewPolicyModel(null)}
                    llmName={viewPolicyModel.name}
                    policyReferences={viewPolicyModel.policyReferences}
                />
            )}
        </div>
    );
}
