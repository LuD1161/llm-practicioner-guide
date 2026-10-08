import { Fragment, useState } from 'react';
import type { jsPDF } from 'jspdf';
import type { RowInput } from 'jspdf-autotable';
import { featureGroups, featureTags } from '../utils/features';
import { ScoredLLM } from '../utils/scoring';
import { Plus, X, Check, Download, FileText, Info } from 'lucide-react';
import PolicyModal from './PolicyModal';
import { Question, UserAnswers } from '../types/quiz';

interface ComparisonTableProps {
    results: ScoredLLM[];
    questions?: Question[];
    userAnswers?: UserAnswers;
}

export default function ComparisonTable({ results, questions, userAnswers }: ComparisonTableProps) {
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

    const handleExport = async () => {
        const jsPDF = (await import('jspdf')).default;
        const autoTable = (await import('jspdf-autotable')).default;

        const doc = new jsPDF();

        // Color mapping for badges (RGB values matching tailwind colors)
        const badgeColors: Record<string, { bg: [number, number, number], text: [number, number, number] }> = {
            'No Training': { bg: [209, 250, 229], text: [4, 120, 87] },      // emerald
            'Opt-out': { bg: [219, 234, 254], text: [29, 78, 216] },         // blue
            'Anonymized': { bg: [254, 243, 199], text: [180, 83, 9] },       // amber
            'Allowed': { bg: [241, 245, 249], text: [51, 65, 85] },          // slate
            'PII': { bg: [241, 245, 249], text: [51, 65, 85] },              // slate
            'Sensitive': { bg: [255, 228, 230], text: [190, 18, 60] },       // rose
            'Minors': { bg: [243, 232, 255], text: [107, 33, 168] },         // purple
            'General': { bg: [209, 250, 229], text: [4, 120, 87] },          // emerald
            'Encryption': { bg: [241, 245, 249], text: [51, 65, 85] },       // slate
            'SSO': { bg: [219, 234, 254], text: [29, 78, 216] },             // blue
            'MFA': { bg: [224, 231, 255], text: [67, 56, 202] },             // indigo
            'Audit Logs': { bg: [237, 233, 254], text: [109, 40, 217] },     // violet
            'DLP': { bg: [252, 231, 243], text: [190, 24, 93] },             // pink
            'GDPR': { bg: [209, 250, 229], text: [4, 120, 87] },             // emerald
            'CCPA': { bg: [219, 234, 254], text: [29, 78, 216] },            // blue
            'HIPAA': { bg: [255, 228, 230], text: [190, 18, 60] },           // rose
            'SOC 2': { bg: [224, 231, 255], text: [67, 56, 202] },           // indigo
            'Delete': { bg: [255, 228, 230], text: [190, 18, 60] },          // rose
            'Access': { bg: [219, 234, 254], text: [29, 78, 216] },          // blue
            'Retention': { bg: [254, 243, 199], text: [180, 83, 9] },        // amber
            'Subprocessors': { bg: [241, 245, 249], text: [51, 65, 85] },    // slate
            'No Analytics Sharing': { bg: [209, 250, 229], text: [4, 120, 87] },    // emerald
            'Policy Notices': { bg: [219, 234, 254], text: [29, 78, 216] },  // blue
            'US': { bg: [219, 234, 254], text: [29, 78, 216] },              // blue
            'EU': { bg: [209, 250, 229], text: [4, 120, 87] },               // emerald
            'Specific Regions': { bg: [243, 232, 255], text: [107, 33, 168] }, // purple
            'Global': { bg: [241, 245, 249], text: [51, 65, 85] },           // slate
            'Breach Notification': { bg: [255, 228, 230], text: [190, 18, 60] }, // rose
            'Reports': { bg: [254, 243, 199], text: [180, 83, 9] },          // amber
            'SLA': { bg: [219, 234, 254], text: [29, 78, 216] },             // blue
            'Self-service': { bg: [209, 250, 229], text: [4, 120, 87] },     // emerald
            'API': { bg: [224, 231, 255], text: [67, 56, 202] },             // indigo
            'On Request': { bg: [254, 243, 199], text: [180, 83, 9] },       // amber
        };

        // Helper function to draw a badge
        const drawBadge = (doc: jsPDF, text: string, x: number, y: number, colors: { bg: [number, number, number], text: [number, number, number] }) => {
            const padding = 2;
            const height = 4;
            doc.setFontSize(7);
            const width = doc.getTextWidth(text) + (padding * 2);

            // Draw rounded rectangle background
            doc.setFillColor(...colors.bg);
            doc.roundedRect(x, y - height + 0.5, width, height, 0.5, 0.5, 'F');

            // Draw text
            doc.setTextColor(...colors.text);
            doc.text(text, x + padding, y);

            return width;
        };

        // PAGE 1: Comparison Table
        doc.setFontSize(20);
        doc.text("LLM Selection Guide - Comparison Report", 14, 22);

        doc.setFontSize(10);
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
        doc.setFontSize(8);
        doc.text('Partial support may require additional controls. Unverified means evidence is missing.', 14, 36);

        // Build the table with tag data
        const tableHead = [['Feature', ...selectedModels.map(m => m.name)]];

        // Store tag data separately for rendering
        const tagData: Record<string, string[]> = {};
        const tableBody: RowInput[] = [];
        featureGroups.forEach((group, groupIndex) => {
            tableBody.push(
                [{ content: group.title.toUpperCase(), colSpan: selectedModels.length + 1, styles: { fillColor: [241, 245, 249], fontStyle: 'bold' } }],
                [group.label, ...selectedModels.map((model, colIndex) => {
                    const tags = featureTags(model, group.options);
                    tagData[`${groupIndex * 2 + 1}-${colIndex + 1}`] = tags;
                    return ' ';
                })]
            );
        });
        tableBody.push(['Match (unverified earns no points)', ...selectedModels.map(model =>
            `${Math.round(model.matchPercentage)}%${model.unverifiedOptions.length ? `; ${model.unverifiedOptions.length} unverified selections` : ''}`
        )]);

        // Strengths and Documentation (no badges needed)
        tableBody.push(
            [{ content: 'KEY STRENGTHS', colSpan: selectedModels.length + 1, styles: { fillColor: [241, 245, 249] as [number, number, number], fontStyle: 'bold' as const } }],
            ['Highlights', ...selectedModels.map(m => m.strengths.join('\n• '))],
            [{ content: 'DOCUMENTATION', colSpan: selectedModels.length + 1, styles: { fillColor: [241, 245, 249] as [number, number, number], fontStyle: 'bold' as const } }],
            ['Policy References', ...selectedModels.map(m => m.policyReferences?.map(r => r.feature).join('\n') || 'None')]
        );

        // Generate table with custom cell rendering for badges
        autoTable(doc, {
            startY: 40,
            head: tableHead,
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42] as [number, number, number], textColor: 255 },
            styles: { fontSize: 9, cellPadding: 3, minCellHeight: 28 },
            rowPageBreak: 'avoid',
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 40 }
            },
            didDrawCell: (data) => {
                // Draw badges for data cells (not header or label cells)
                if (data.section === 'body' && data.column.index > 0) {
                    const key = `${data.row.index}-${data.column.index}`;
                    const tags = tagData[key];

                    if (tags && tags.length > 0) {
                        const cellWidth = data.cell.width - 4;
                        const startX = data.cell.x + 2;
                        const startY = data.cell.y + 4;

                        let xOffset = startX;
                        let yOffset = startY;
                        let currentLineWidth = 0;

                        tags.forEach((tag) => {
                            const colors = badgeColors[tag] || { bg: [241, 245, 249], text: [51, 65, 85] };
                            doc.setFontSize(7);
                            const badgeWidth = doc.getTextWidth(tag) + 4;

                            // Check if we need to wrap to next line
                            if (currentLineWidth + badgeWidth > cellWidth && currentLineWidth > 0) {
                                currentLineWidth = 0;
                                xOffset = startX;
                                yOffset += 6;  // Move to next line
                            }

                            // Draw the badge
                            const width = drawBadge(doc, tag, xOffset, yOffset, colors);
                            xOffset += width + 2;  // Add gap between badges
                            currentLineWidth += badgeWidth + 2;
                        });

                        // Reset text color
                        doc.setTextColor(0, 0, 0);
                    }
                }
            }
        });

        // PAGE 2: Questions and Answers
        if (questions && userAnswers) {
            doc.addPage();
            doc.setFontSize(16);
            doc.text("Quiz Questions & Your Answers", 14, 20);

            let yPosition = 30;

            questions.forEach((question, index) => {
                // Check if we need a new page
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }

                // Question
                doc.setFontSize(11);
                doc.setFont('', 'bold');
                doc.text(`Q${index + 1}: ${question.question}`, 14, yPosition);
                yPosition += 7;

                // Selected answer(s)
                const answer = userAnswers[question.id];
                if (answer) {
                    doc.setFont('', 'normal');
                    doc.setFontSize(10);
                    doc.setTextColor(0, 100, 0);

                    const answerIds = Array.isArray(answer) ? answer : [answer];
                    answerIds.forEach(answerId => {
                        const option = question.options.find(o => o.id === answerId);
                        if (option) {
                            doc.text(`✓ ${option.label}`, 20, yPosition);
                            yPosition += 6;
                        }
                    });

                    doc.setTextColor(0, 0, 0);
                }

                yPosition += 5;
            });
        }

        doc.save('llm-comparison-report.pdf');
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

            <p className="text-xs text-slate-600 mb-3">
                Unverified means evidence is missing and earns no match points. Partial support may require additional controls; review policy details.
            </p>
            <div className="flex-1 min-h-0 overflow-auto border border-slate-200 rounded-xl bg-white shadow-sm">
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
                                        <div className="flex items-center gap-2 mb-2 relative group/tooltip cursor-help">
                                            <div className="text-2xl font-bold text-slate-900">{Math.round(model.matchPercentage)}%</div>
                                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                Match
                                                <Info size={12} className="text-emerald-600" />
                                            </span>

                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 text-center font-normal shadow-xl pointer-events-none">
                                                Based on your configured requirements. Unverified selections earn no points; a lower match may reflect missing evidence.
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                            </div>
                                        </div>
                                        {model.unverifiedOptions.length > 0 && (
                                            <p className="text-xs text-amber-800 mb-2">{model.unverifiedOptions.length} unverified selection(s)</p>
                                        )}
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
                        {featureGroups.map(group => (
                            <Fragment key={group.title}>
                                <tr className="bg-slate-50/50">
                                    <td colSpan={selectedModels.length + (selectedModelIds.length < 4 ? 2 : 1)} className="p-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0">
                                        {group.title}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">{group.label}</td>
                                    {selectedModels.map(model => (
                                        <td key={model.id} className="p-4 border-r border-slate-200">
                                            <div className="flex flex-wrap justify-center gap-1">
                                                {featureTags(model, group.options).map(tag => (
                                                    <span key={tag} title={tag === 'Unverified' ? group.options.filter(([id]) => model.scores[id] == null).map(([, label]) => label).join(', ') : undefined}
                                                        className={`text-xs px-2 py-0.5 rounded font-medium ${tag === 'Unverified' || tag.includes('(partial)') ? 'bg-amber-100 text-amber-800' : tag === 'No confirmed support' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-800'}`}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    ))}
                                    {selectedModelIds.length < 4 && <td />}
                                </tr>
                            </Fragment>
                        ))}

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
