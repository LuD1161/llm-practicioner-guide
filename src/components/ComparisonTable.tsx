import { useState } from 'react';
import { ScoredLLM } from '../utils/scoring';
import { Plus, X, Check, Download, FileText, Info } from 'lucide-react';
import PolicyModal from './PolicyModal';

interface ComparisonTableProps {
    results: ScoredLLM[];
}

export default function ComparisonTable({ results }: ComparisonTableProps) {
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
        // Dynamically import jspdf to avoid SSR issues if any, and keep bundle size optimized
        const jsPDF = (await import('jspdf')).default;
        const autoTable = (await import('jspdf-autotable')).default;

        const doc = new jsPDF();

        // Add Title
        doc.setFontSize(20);
        doc.text("LLM Selection Guide - Comparison Report", 14, 22);

        doc.setFontSize(10);
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

        // Prepare table data
        const tableHead = [['Feature', ...selectedModels.map(m => m.name)]];

        const tableBody = [
            // Training Policy
            [{ content: 'TRAINING POLICY', colSpan: selectedModels.length + 1, styles: { fillColor: [241, 245, 249] as [number, number, number], fontStyle: 'bold' as const } }],
            ['Model Training', ...selectedModels.map(m => {
                const tags = [];
                if (m.scores?.['train-none'] === 10) tags.push('No Training');
                if (m.scores?.['train-opt-out'] === 10) tags.push('Opt-out');
                if (m.scores?.['train-anon'] === 10) tags.push('Anonymized');
                if (m.scores?.['train-allow'] === 10) tags.push('Allowed');
                return tags.join(', ') || '-';
            })],

            // Data Support
            [{ content: 'DATA SUPPORT', colSpan: selectedModels.length + 1, styles: { fillColor: [241, 245, 249] as [number, number, number], fontStyle: 'bold' as const } }],
            ['Supported Data Types', ...selectedModels.map(m => {
                const tags = [];
                if (m.scores?.['data-pii'] === 10) tags.push('PII');
                if (m.scores?.['data-sensitive'] === 10) tags.push('Sensitive');
                if (m.scores?.['data-minors'] === 10) tags.push('Minors');
                if (m.scores?.['data-general'] === 10) tags.push('General');
                return tags.join(', ') || '-';
            })],

            // Security
            [{ content: 'SECURITY FEATURES', colSpan: selectedModels.length + 1, styles: { fillColor: [241, 245, 249] as [number, number, number], fontStyle: 'bold' as const } }],
            ['Available Features', ...selectedModels.map(m => {
                const tags = [];
                if (m.scores?.['sec-enc'] === 10) tags.push('Encryption');
                if (m.scores?.['sec-sso'] === 10) tags.push('SSO');
                if (m.scores?.['sec-mfa'] === 10) tags.push('MFA');
                if (m.scores?.['sec-audit'] === 10) tags.push('Audit Logs');
                if (m.scores?.['sec-dlp'] === 10) tags.push('DLP');
                return tags.join(', ') || '-';
            })],

            // Compliance
            [{ content: 'COMPLIANCE & CERTIFICATIONS', colSpan: selectedModels.length + 1, styles: { fillColor: [241, 245, 249] as [number, number, number], fontStyle: 'bold' as const } }],
            ['Certifications', ...selectedModels.map(m => {
                const tags = [];
                if (m.scores?.['comp-gdpr'] === 10) tags.push('GDPR');
                if (m.scores?.['comp-ccpa'] === 10) tags.push('CCPA');
                if (m.scores?.['comp-hipaa'] === 10) tags.push('HIPAA');
                if (m.scores?.['comp-soc2'] === 10) tags.push('SOC 2');
                return tags.join(', ') || '-';
            })],

            // User Rights
            [{ content: 'USER RIGHTS', colSpan: selectedModels.length + 1, styles: { fillColor: [241, 245, 249] as [number, number, number], fontStyle: 'bold' as const } }],
            ['Available Rights', ...selectedModels.map(m => {
                const tags = [];
                if (m.scores?.['right-delete'] === 10) tags.push('Delete');
                if (m.scores?.['right-access'] === 10) tags.push('Access');
                if (m.scores?.['right-retention'] === 10) tags.push('Retention');
                return tags.join(', ') || '-';
            })],

            // Transparency
            [{ content: 'TRANSPARENCY', colSpan: selectedModels.length + 1, styles: { fillColor: [241, 245, 249] as [number, number, number], fontStyle: 'bold' as const } }],
            ['Transparency Features', ...selectedModels.map(m => {
                const tags = [];
                if (m.scores?.['trans-subproc'] === 10) tags.push('Subprocessors');
                if (m.scores?.['trans-sharing'] === 10) tags.push('No Ad Sharing');
                if (m.scores?.['trans-notify'] === 10) tags.push('Policy Notices');
                return tags.join(', ') || '-';
            })],

            // Data Residency
            [{ content: 'DATA LOCATION', colSpan: selectedModels.length + 1, styles: { fillColor: [241, 245, 249] as [number, number, number], fontStyle: 'bold' as const } }],
            ['Data Residency', ...selectedModels.map(m => {
                const tags = [];
                if (m.scores?.['residency-us'] === 10) tags.push('US');
                if (m.scores?.['residency-eu'] === 10) tags.push('EU');
                if (m.scores?.['residency-specific'] === 10) tags.push('Specific Regions');
                if (m.scores?.['residency-global'] === 10) tags.push('Global');
                return tags.join(', ') || '-';
            })],

            // Incident Response
            [{ content: 'INCIDENT RESPONSE', colSpan: selectedModels.length + 1, styles: { fillColor: [241, 245, 249] as [number, number, number], fontStyle: 'bold' as const } }],
            ['Response Capabilities', ...selectedModels.map(m => {
                const tags = [];
                if (m.scores?.['incident-breach'] === 10) tags.push('Breach Notification');
                if (m.scores?.['incident-reports'] === 10) tags.push('Reports');
                if (m.scores?.['incident-sla'] === 10) tags.push('SLA');
                return tags.join(', ') || '-';
            })],

            // Data Portability
            [{ content: 'DATA PORTABILITY', colSpan: selectedModels.length + 1, styles: { fillColor: [241, 245, 249] as [number, number, number], fontStyle: 'bold' as const } }],
            ['Export Capabilities', ...selectedModels.map(m => {
                const tags = [];
                if (m.scores?.['portability-self'] === 10) tags.push('Self-service');
                if (m.scores?.['portability-api'] === 10) tags.push('API');
                if (m.scores?.['portability-request'] === 10) tags.push('On Request');
                return tags.join(', ') || '-';
            })],

            // Strengths Section
            [{ content: 'KEY STRENGTHS', colSpan: selectedModels.length + 1, styles: { fillColor: [241, 245, 249] as [number, number, number], fontStyle: 'bold' as const } }],
            ['Highlights', ...selectedModels.map(m => m.strengths.join('\n• '))],

            // Policy Section
            [{ content: 'DOCUMENTATION', colSpan: selectedModels.length + 1, styles: { fillColor: [241, 245, 249] as [number, number, number], fontStyle: 'bold' as const } }],
            ['Policy References', ...selectedModels.map(m => m.policyReferences?.map(r => r.feature).join('\n') || 'None')]
        ];

        // Generate table
        autoTable(doc, {
            startY: 40,
            head: tableHead,
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42] as [number, number, number], textColor: 255 },
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 40 }
            }
        });

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
                                        <div className="flex items-center gap-2 mb-2 relative group/tooltip cursor-help">
                                            <div className="text-2xl font-bold text-slate-900">{Math.round(model.matchPercentage)}%</div>
                                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                Match
                                                <Info size={12} className="text-emerald-600" />
                                            </span>

                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 text-center font-normal shadow-xl pointer-events-none">
                                                Based on your configured requirements. Higher % means better alignment with your needs.
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                            </div>
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
                        {/* Training Policy */}
                        <tr className="bg-slate-50/50">
                            <td colSpan={selectedModels.length + 2} className="p-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0">
                                Training Policy
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">Model Training</td>
                            {selectedModels.map(m => (
                                <td key={m.id} className="p-4 border-r border-slate-200">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {m.scores?.['train-none'] === 10 && <span className="text-xs bg-emerald-100 px-2 py-0.5 rounded text-emerald-700 font-medium">No Training</span>}
                                        {m.scores?.['train-opt-out'] === 10 && <span className="text-xs bg-blue-100 px-2 py-0.5 rounded text-blue-700 font-medium">Opt-out</span>}
                                        {m.scores?.['train-anon'] === 10 && <span className="text-xs bg-amber-100 px-2 py-0.5 rounded text-amber-700 font-medium">Anonymized</span>}
                                        {m.scores?.['train-allow'] === 10 && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">Allowed</span>}
                                    </div>
                                </td>
                            ))}
                            {selectedModelIds.length < 4 && <td />}
                        </tr>

                        {/* Data Sensitivity */}
                        <tr className="bg-slate-50/50">
                            <td colSpan={selectedModels.length + 2} className="p-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0">
                                Data Support
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">Supported Data Types</td>
                            {selectedModels.map(m => (
                                <td key={m.id} className="p-4 border-r border-slate-200">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {m.scores?.['data-pii'] === 10 && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">PII</span>}
                                        {m.scores?.['data-sensitive'] === 10 && <span className="text-xs bg-rose-100 px-2 py-0.5 rounded text-rose-700">Sensitive</span>}
                                        {m.scores?.['data-minors'] === 10 && <span className="text-xs bg-purple-100 px-2 py-0.5 rounded text-purple-700">Minors</span>}
                                        {m.scores?.['data-general'] === 10 && <span className="text-xs bg-emerald-100 px-2 py-0.5 rounded text-emerald-700">General</span>}
                                    </div>
                                </td>
                            ))}
                            {selectedModelIds.length < 4 && <td />}
                        </tr>

                        {/* Security */}
                        <tr className="bg-slate-50/50">
                            <td colSpan={selectedModels.length + 2} className="p-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0">
                                Security Features
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">Available Features</td>
                            {selectedModels.map(m => (
                                <td key={m.id} className="p-4 border-r border-slate-200">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {m.scores?.['sec-enc'] === 10 && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">Encryption</span>}
                                        {m.scores?.['sec-sso'] === 10 && <span className="text-xs bg-blue-100 px-2 py-0.5 rounded text-blue-700">SSO</span>}
                                        {m.scores?.['sec-mfa'] === 10 && <span className="text-xs bg-indigo-100 px-2 py-0.5 rounded text-indigo-700">MFA</span>}
                                        {m.scores?.['sec-audit'] === 10 && <span className="text-xs bg-violet-100 px-2 py-0.5 rounded text-violet-700">Audit Logs</span>}
                                        {m.scores?.['sec-dlp'] === 10 && <span className="text-xs bg-pink-100 px-2 py-0.5 rounded text-pink-700">DLP</span>}
                                    </div>
                                </td>
                            ))}
                            {selectedModelIds.length < 4 && <td />}
                        </tr>

                        {/* Compliance */}
                        <tr className="bg-slate-50/50">
                            <td colSpan={selectedModels.length + 2} className="p-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0">
                                Compliance & Certifications
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">Certifications</td>
                            {selectedModels.map(m => (
                                <td key={m.id} className="p-4 border-r border-slate-200">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {m.scores?.['comp-gdpr'] === 10 && <span className="text-xs bg-emerald-100 px-2 py-0.5 rounded text-emerald-700 font-medium">GDPR</span>}
                                        {m.scores?.['comp-ccpa'] === 10 && <span className="text-xs bg-blue-100 px-2 py-0.5 rounded text-blue-700 font-medium">CCPA</span>}
                                        {m.scores?.['comp-hipaa'] === 10 && <span className="text-xs bg-rose-100 px-2 py-0.5 rounded text-rose-700 font-medium">HIPAA</span>}
                                        {m.scores?.['comp-soc2'] === 10 && <span className="text-xs bg-indigo-100 px-2 py-0.5 rounded text-indigo-700 font-medium">SOC 2</span>}
                                    </div>
                                </td>
                            ))}
                            {selectedModelIds.length < 4 && <td />}
                        </tr>

                        {/* User Rights */}
                        <tr className="bg-slate-50/50">
                            <td colSpan={selectedModels.length + 2} className="p-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0">
                                User Rights
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">Available Rights</td>
                            {selectedModels.map(m => (
                                <td key={m.id} className="p-4 border-r border-slate-200">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {m.scores?.['right-delete'] === 10 && <span className="text-xs bg-rose-100 px-2 py-0.5 rounded text-rose-700">Delete</span>}
                                        {m.scores?.['right-access'] === 10 && <span className="text-xs bg-blue-100 px-2 py-0.5 rounded text-blue-700">Access</span>}
                                        {m.scores?.['right-retention'] === 10 && <span className="text-xs bg-amber-100 px-2 py-0.5 rounded text-amber-700">Retention</span>}
                                    </div>
                                </td>
                            ))}
                            {selectedModelIds.length < 4 && <td />}
                        </tr>

                        {/* Transparency */}
                        <tr className="bg-slate-50/50">
                            <td colSpan={selectedModels.length + 2} className="p-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0">
                                Transparency
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">Transparency Features</td>
                            {selectedModels.map(m => (
                                <td key={m.id} className="p-4 border-r border-slate-200">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {m.scores?.['trans-subproc'] === 10 && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">Subprocessors</span>}
                                        {m.scores?.['trans-sharing'] === 10 && <span className="text-xs bg-emerald-100 px-2 py-0.5 rounded text-emerald-700">No Ad Sharing</span>}
                                        {m.scores?.['trans-notify'] === 10 && <span className="text-xs bg-blue-100 px-2 py-0.5 rounded text-blue-700">Policy Notices</span>}
                                    </div>
                                </td>
                            ))}
                            {selectedModelIds.length < 4 && <td />}
                        </tr>

                        {/* Data Residency */}
                        <tr className="bg-slate-50/50">
                            <td colSpan={selectedModels.length + 2} className="p-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0">
                                Data Location
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">Data Residency</td>
                            {selectedModels.map(m => (
                                <td key={m.id} className="p-4 border-r border-slate-200">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {m.scores?.['residency-us'] === 10 && <span className="text-xs bg-blue-100 px-2 py-0.5 rounded text-blue-700">US</span>}
                                        {m.scores?.['residency-eu'] === 10 && <span className="text-xs bg-emerald-100 px-2 py-0.5 rounded text-emerald-700">EU</span>}
                                        {m.scores?.['residency-specific'] === 10 && <span className="text-xs bg-purple-100 px-2 py-0.5 rounded text-purple-700">Specific Regions</span>}
                                        {m.scores?.['residency-global'] === 10 && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">Global</span>}
                                    </div>
                                </td>
                            ))}
                            {selectedModelIds.length < 4 && <td />}
                        </tr>

                        {/* Incident Response */}
                        <tr className="bg-slate-50/50">
                            <td colSpan={selectedModels.length + 2} className="p-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0">
                                Incident Response
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">Response Capabilities</td>
                            {selectedModels.map(m => (
                                <td key={m.id} className="p-4 border-r border-slate-200">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {m.scores?.['incident-breach'] === 10 && <span className="text-xs bg-rose-100 px-2 py-0.5 rounded text-rose-700">Breach Notification</span>}
                                        {m.scores?.['incident-reports'] === 10 && <span className="text-xs bg-amber-100 px-2 py-0.5 rounded text-amber-700">Reports</span>}
                                        {m.scores?.['incident-sla'] === 10 && <span className="text-xs bg-blue-100 px-2 py-0.5 rounded text-blue-700">SLA</span>}
                                    </div>
                                </td>
                            ))}
                            {selectedModelIds.length < 4 && <td />}
                        </tr>

                        {/* Data Portability */}
                        <tr className="bg-slate-50/50">
                            <td colSpan={selectedModels.length + 2} className="p-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0">
                                Data Portability
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 text-sm font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">Export Capabilities</td>
                            {selectedModels.map(m => (
                                <td key={m.id} className="p-4 border-r border-slate-200">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {m.scores?.['portability-self'] === 10 && <span className="text-xs bg-emerald-100 px-2 py-0.5 rounded text-emerald-700">Self-service</span>}
                                        {m.scores?.['portability-api'] === 10 && <span className="text-xs bg-indigo-100 px-2 py-0.5 rounded text-indigo-700">API</span>}
                                        {m.scores?.['portability-request'] === 10 && <span className="text-xs bg-amber-100 px-2 py-0.5 rounded text-amber-700">On Request</span>}
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
