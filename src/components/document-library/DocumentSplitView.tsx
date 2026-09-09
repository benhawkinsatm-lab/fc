import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  Tag, 
  ShieldCheck, 
  Scale, 
  Calendar, 
  Building2, 
  Maximize2,
  Stethoscope,
  GraduationCap,
  MessageSquare,
  Receipt,
  Trophy,
  Search,
  CheckCircle2,
  Layers,
  ChevronRight
} from 'lucide-react';
import { DocumentRecord, DocumentCategory } from '../../types';

interface DocumentSplitViewProps {
  documents: DocumentRecord[];
  selectedDocIds: Set<string>;
  onToggleSelectDoc: (id: string) => void;
  onViewDocument: (doc: DocumentRecord) => void;
  onTagClick?: (tag: string) => void;
}

export const DocumentSplitView: React.FC<DocumentSplitViewProps> = ({
  documents,
  selectedDocIds,
  onToggleSelectDoc,
  onViewDocument,
  onTagClick,
}) => {
  const [activeDocId, setActiveDocId] = useState<string>(documents[0]?.id || '');
  const [listSearch, setListSearch] = useState('');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [copiedExcerpt, setCopiedExcerpt] = useState(false);

  // If documents changes or activeDocId not in list, fallback to first
  useEffect(() => {
    if (documents.length > 0 && (!activeDocId || !documents.some(d => d.id === activeDocId))) {
      setActiveDocId(documents[0].id);
    }
  }, [documents, activeDocId]);

  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];

  const filteredList = documents.filter(d => {
    if (!listSearch.trim()) return true;
    const q = listSearch.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      (d.annexureNumber && d.annexureNumber.toLowerCase().includes(q)) ||
      d.sourceOrigin.toLowerCase().includes(q)
    );
  });

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case 'Medical': return Stethoscope;
      case 'Education': return GraduationCap;
      case 'Legal/Court': return Scale;
      case 'Direct Communication': return MessageSquare;
      case 'Financial': return Receipt;
      case 'Extracurricular': return Trophy;
      default: return FileText;
    }
  };

  const handleCopyCitation = () => {
    if (!activeDoc) return;
    const citation = `${activeDoc.annexureNumber || activeDoc.id}: "${activeDoc.title}" (${activeDoc.date}), source: ${activeDoc.sourceOrigin}.`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const handleCopyExcerpt = () => {
    if (!activeDoc) return;
    navigator.clipboard.writeText(activeDoc.excerpt);
    setCopiedExcerpt(true);
    setTimeout(() => setCopiedExcerpt(false), 2000);
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 italic text-xs">
        No documents available to display.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[780px] bg-slate-100 p-2 rounded-2xl border border-slate-200 shadow-xs">
      {/* Left Master List (5 cols) */}
      <div className="lg:col-span-5 flex flex-col bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden h-full">
        {/* List Header & Quick Filter */}
        <div className="p-3 border-b border-slate-200 bg-slate-50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5 font-serif">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Document Index ({filteredList.length})</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Click record to inspect
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
              placeholder="Quick search active list..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Scrollable Document List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredList.map((doc) => {
            const isActive = doc.id === activeDocId;
            const isSelected = selectedDocIds.has(doc.id);
            const CategoryIcon = getCategoryIcon(doc.category);

            return (
              <div
                key={doc.id}
                onClick={() => setActiveDocId(doc.id)}
                className={`p-3 transition-colors cursor-pointer flex items-start gap-2.5 ${
                  isActive 
                    ? 'bg-amber-50/70 border-l-4 border-amber-500 text-slate-900 shadow-xs' 
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                {/* Select Checkbox */}
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="pt-0.5"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelectDoc(doc.id)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate">
                      {doc.annexureNumber ? (
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded border border-amber-200">
                          {doc.annexureNumber}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-slate-400">
                          {doc.id}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {doc.date}
                      </span>
                    </div>

                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                      {doc.category}
                    </span>
                  </div>

                  <h4 className={`text-xs font-semibold truncate ${isActive ? 'text-slate-950 font-bold' : 'text-slate-800'}`}>
                    {doc.title}
                  </h4>

                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="truncate max-w-[140px]">{doc.sourceOrigin}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-medium ${
                      doc.evidentiaryWeight === 'Sworn/Official' 
                        ? 'text-purple-700 bg-purple-50' 
                        : doc.evidentiaryWeight === 'Third-Party Objective'
                        ? 'text-blue-700 bg-blue-50'
                        : 'text-amber-700 bg-amber-50'
                    }`}>
                      {doc.evidentiaryWeight}
                    </span>
                  </div>
                </div>

                <ChevronRight className={`w-3.5 h-3.5 mt-2 transition-transform ${isActive ? 'text-amber-600 translate-x-0.5' : 'text-slate-300'}`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Detail Inspector (7 cols) */}
      <div className="lg:col-span-7 flex flex-col bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden h-full">
        {activeDoc ? (
          <>
            {/* Inspector Top Bar */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {activeDoc.annexureNumber && (
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded shadow-2xs">
                      {activeDoc.annexureNumber}
                    </span>
                  )}
                  <span className="font-mono text-xs font-semibold text-slate-500">
                    {activeDoc.id}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs text-slate-600 font-medium">
                    {activeDoc.date}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    activeDoc.evidentiaryWeight === 'Sworn/Official'
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : activeDoc.evidentiaryWeight === 'Third-Party Objective'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {activeDoc.evidentiaryWeight}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-slate-900 font-serif leading-tight">
                  {activeDoc.title}
                </h2>
                <div className="text-xs text-slate-500">
                  Origin: <strong className="text-slate-700">{activeDoc.sourceOrigin}</strong>
                </div>
              </div>

              {/* Inspector Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyCitation}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition"
                  title="Copy Court Citation Particular"
                >
                  {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCitation ? 'Copied' : 'Cite'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onViewDocument(activeDoc)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  id="split-view-open-modal-btn"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Record</span>
                </button>
              </div>
            </div>

            {/* Scrollable Inspector Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Primary Key Excerpt Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <span>Verbatim Court Excerpt / Key Citation</span>
                  <button
                    onClick={handleCopyExcerpt}
                    className="text-indigo-600 hover:underline flex items-center gap-1 capitalize normal-case text-xs"
                  >
                    {copiedExcerpt ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedExcerpt ? 'Copied Excerpt' : 'Copy Excerpt'}</span>
                  </button>
                </div>

                <div className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-xl font-serif text-slate-800 italic leading-relaxed text-xs">
                  "{activeDoc.excerpt}"
                </div>
              </div>

              {/* Tags */}
              {activeDoc.tags && activeDoc.tags.length > 0 && (
                <div className="space-y-1">
                  <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    Legal Schema Tags:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDoc.tags.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => onTagClick?.(t)}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200 hover:bg-amber-100 hover:text-amber-900 transition"
                      >
                        #{t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Text / Document Reader */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <span>Transcript / Document OCR Content</span>
                  <span className="font-mono text-slate-400 text-[10px]">
                    {activeDoc.fullText?.length || 0} characters
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap select-text">
                  {activeDoc.fullText || activeDoc.excerpt}
                </div>
              </div>

              {/* Document Metadata Grid */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block mb-2">
                  Technical &amp; Evidentiary Provenance:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Category</span>
                    <strong className="text-xs">{activeDoc.category}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Format</span>
                    <strong className="text-xs uppercase">{activeDoc.fileType}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">File Size</span>
                    <strong className="text-xs">{activeDoc.fileSize || 'Verified OCR'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Status</span>
                    <strong className="text-xs text-emerald-700">Indexed for Form 2</strong>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 italic text-xs">
            Select a document from the left to inspect its contents.
          </div>
        )}
      </div>
    </div>
  );
};
