import React, { useState } from 'react';
import { 
  FolderArchive, 
  Printer, 
  Download, 
  ExternalLink, 
  FileCheck, 
  Check, 
  Copy, 
  Scale,
  ShieldCheck,
  Archive
} from 'lucide-react';
import { DocumentRecord, TimelineEvent, ParentingOrder, DiscrepancyItem, CourtCriterion } from '../types';
import { CaseDossierExportModal } from './CaseDossierExportModal';

interface EvidenceBinderProps {
  documents: DocumentRecord[];
  onViewDocument: (doc: DocumentRecord) => void;
  preselectedDocIds?: string[];
  timeline?: TimelineEvent[];
  orders?: ParentingOrder[];
  discrepancies?: DiscrepancyItem[];
  courtCriteria?: CourtCriterion[];
}

export const EvidenceBinder: React.FC<EvidenceBinderProps> = ({
  documents,
  onViewDocument,
  preselectedDocIds,
  timeline = [],
  orders = [],
  discrepancies = [],
  courtCriteria = [],
}) => {
  const [selectedDocs, setSelectedDocs] = useState<string[]>(() => {
    if (preselectedDocIds && preselectedDocIds.length > 0) {
      return preselectedDocIds;
    }
    return documents.map(d => d.id);
  });
  const [copied, setCopied] = useState(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);

  React.useEffect(() => {
    if (preselectedDocIds && preselectedDocIds.length > 0) {
      setSelectedDocs(preselectedDocIds);
    }
  }, [preselectedDocIds]);

  const toggleSelect = (id: string) => {
    setSelectedDocs(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedDocs(documents.map(d => d.id));
  const deselectAll = () => setSelectedDocs([]);

  const activeDocuments = documents
    .filter(d => selectedDocs.includes(d.id))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handlePrint = () => {
    window.print();
  };

  const copyIndexText = () => {
    let text = "FAMILY COURT OF WESTERN AUSTRALIA • CASE NO: 4344/2023\n";
    text += "HAWKINS v HAWKINS • INDEX OF ANNEXURES TO AFFIDAVIT OF BENJAMIN JAMES HAWKINS\n\n";
    text += "ANNEXURE | DATE | DESCRIPTION | SOURCE ORIGIN | EVIDENTIARY WEIGHT\n";
    text += "--------------------------------------------------------------------------------\n";
    activeDocuments.forEach(doc => {
      text += `${doc.annexureNumber || doc.id} | ${doc.date} | ${doc.title} | ${doc.sourceOrigin} | ${doc.evidentiaryWeight}\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12" id="evidence-binder-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-amber-500" />
            <span>Evidence Binder &amp; Annexure Index</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Court-ready compilation of primary documents, sworn affidavits, and institutional audits indexed with Bates stamps (BJH-001 to BJH-099).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDossierModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            id="export-dossier-zip-btn"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Export Case Dossier (ZIP)</span>
          </button>
          <button
            onClick={copyIndexText}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            id="copy-binder-index-btn"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Index Copied' : 'Copy Table of Annexures'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            id="print-court-bundle-btn"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Court Bundle</span>
          </button>
        </div>
      </div>

      {/* Selector Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Selected Annexures:</span>
          <span className="font-mono font-bold text-indigo-700 px-2 py-0.5 bg-indigo-50 rounded border border-indigo-200">
            {activeDocuments.length} of {documents.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={selectAll}
            className="text-indigo-600 hover:underline font-medium"
          >
            Select All
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={deselectAll}
            className="text-slate-500 hover:underline font-medium"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Court Bundle Layout View */}
      <div className="bg-white rounded-xl border border-slate-300 p-8 sm:p-10 shadow-lg space-y-6 print:p-0 print:border-none print:shadow-none">
        {/* Certificate of Identification Cover */}
        <div className="border-2 border-slate-800 p-6 rounded-lg space-y-3 font-serif text-slate-900 bg-slate-50/50">
          <div className="text-center space-y-1">
            <h2 className="text-xs uppercase tracking-widest font-bold text-slate-700">
              IN THE FAMILY COURT OF WESTERN AUSTRALIA
            </h2>
            <h3 className="text-xs font-mono font-bold text-slate-800">
              FILE NUMBER: 4344/2023
            </h3>
            <p className="text-xs pt-1">
              BENJAMIN JAMES HAWKINS (Applicant) and SUE-ANNE HAWKINS (Respondent)
            </p>
            <h1 className="text-base font-bold uppercase tracking-wide pt-2">
              CERTIFICATE OF IDENTIFICATION OF ANNEXURES
            </h1>
          </div>

          <p className="text-xs leading-relaxed pt-2">
            This is the Master Index of Annexures marked <strong>"BJH-1"</strong> to <strong>"BJH-{activeDocuments.length}"</strong> referred to in the Affidavit of <strong>BENJAMIN JAMES HAWKINS</strong> sworn at Perth this _____ day of ___________________ 2024 before me:
          </p>

          <div className="pt-4 flex justify-between text-xs text-slate-600">
            <div>
              <div className="border-b border-slate-400 w-48 mb-1"></div>
              <span>Deponent (Benjamin Hawkins)</span>
            </div>
            <div>
              <div className="border-b border-slate-400 w-64 mb-1"></div>
              <span>Justice of the Peace / Australian Legal Practitioner</span>
            </div>
          </div>
        </div>

        {/* Master Index Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-700">
            Chronological Schedule of Primary Evidentiary Records
          </h3>

          <div className="overflow-x-auto border border-slate-300 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                  <th className="p-3 w-12 text-center print:hidden">Inc</th>
                  <th className="p-3 w-28">Annexure</th>
                  <th className="p-3 w-24">Date</th>
                  <th className="p-3">Title &amp; Factual Description</th>
                  <th className="p-3 w-36">Source Origin</th>
                  <th className="p-3 w-32">Weight</th>
                  <th className="p-3 w-20 text-right print:hidden">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activeDocuments.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-center print:hidden">
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => toggleSelect(doc.id)}
                        className="rounded text-indigo-600"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-indigo-900 whitespace-nowrap">
                      {doc.annexureNumber || `Annexure BJH-${idx + 1}`}
                    </td>
                    <td className="p-3 font-mono text-slate-700 whitespace-nowrap">
                      {doc.date}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{doc.title}</div>
                      <div className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-1">"{doc.excerpt}"</div>
                    </td>
                    <td className="p-3 text-slate-700 font-medium">
                      {doc.sourceOrigin}
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        doc.evidentiaryWeight === 'Sworn/Official'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : doc.evidentiaryWeight === 'Third-Party Objective'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {doc.evidentiaryWeight}
                      </span>
                    </td>
                    <td className="p-3 text-right print:hidden">
                      <button
                        onClick={() => onViewDocument(doc)}
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-900 font-semibold"
                        id={`view-binder-annexure-${doc.id}`}
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Case Dossier Export Modal */}
      <CaseDossierExportModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
        documents={activeDocuments}
        timeline={timeline}
        orders={orders}
        discrepancies={discrepancies}
        courtCriteria={courtCriteria}
      />
    </div>
  );
};
