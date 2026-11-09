import React, { useState } from 'react';
import { CheckSquare, Square, Clock, FileText, Lightbulb } from 'lucide-react';
import { Scholarship } from '../../types';

interface HowToApplyRoadmapProps {
  scholarship: Scholarship;
}

export const HowToApplyRoadmap: React.FC<HowToApplyRoadmapProps> = ({ scholarship }) => {
  // Local checked state for documents preview
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});

  const toggleDoc = (index: number) => {
    setCheckedDocs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section
      aria-labelledby="apply-roadmap-heading"
      className="bg-surface-card border border-border-hairline rounded-[16px] p-6 md:p-8"
    >
      {/* Editorial Section Numbering */}
      <div className="flex items-center gap-2 text-xs font-mono text-ink-muted mb-2">
        <span className="font-semibold text-brand-primary">03</span>
        <span>/ APPLY</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <h2 id="apply-roadmap-heading" className="font-serif text-2xl md:text-3xl text-ink-primary font-normal">
            How to Apply
          </h2>
          <p className="text-sm text-ink-muted mt-1">
            Follow this chronological roadmap to assemble a complete, competitive dossier.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-raised border border-border-hairline rounded-[8px] text-xs font-mono text-ink-primary tabular-nums shrink-0 self-start sm:self-auto">
          <Clock className="w-4 h-4 text-brand-primary" aria-hidden="true" />
          <span>Estimated effort: ~{scholarship.estimatedHours} hours</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Ordered Application Steps (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Application Sequence
          </h3>
          <ol className="relative border-l-2 border-border-hairline ml-3.5 space-y-6">
            {scholarship.applicationSteps.map((step) => (
              <li key={step.step} className="pl-6 relative group/step hover:-translate-y-0.5 transition-all duration-200">
                <span className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-surface-card border-2 border-brand-primary text-brand-primary font-mono text-xs font-bold flex items-center justify-center transition-all duration-200 group-hover/step:scale-110 group-hover/step:bg-brand-primary group-hover/step:text-brand-contrast shadow-2xs">
                  {step.step}
                </span>
                <div className="pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-semibold text-ink-primary group-hover/step:text-brand-primary transition-colors">
                      {step.title}
                    </h4>
                    {step.estimatedHours && (
                      <span className="text-[11px] font-mono text-ink-muted shrink-0">
                        ~{step.estimatedHours}h
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Required Documents Checklist (1 Col) */}
        <div className="space-y-4">
          <div className="p-5 bg-surface-raised/70 border border-border-subtle rounded-[14px]">
            <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-3 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-brand-primary" aria-hidden="true" />
              <span>Required Documents ({scholarship.documentsRequired.length})</span>
            </h3>
            <ul className="space-y-1.5">
              {scholarship.documentsRequired.map((doc, idx) => {
                const isChecked = !!checkedDocs[idx];
                return (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => toggleDoc(idx)}
                      className="w-full text-left flex items-start gap-2.5 text-xs text-ink-primary group focus-visible:ring-1 focus-visible:ring-brand-primary rounded-[6px] p-2 -mx-1 hover:bg-surface-card hover:translate-x-0.5 active:scale-98 transition-all duration-150 cursor-pointer"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-brand-primary shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                      ) : (
                        <Square className="w-4 h-4 text-ink-muted group-hover:text-brand-primary shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                      )}
                      <span className={`transition-all duration-200 ${isChecked ? 'line-through text-ink-muted' : 'group-hover:text-brand-primary'}`}>
                        {doc}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Submission Tip */}
          <div className="p-4 bg-accent-light/50 border border-accent-saffron/30 rounded-[12px] flex items-start gap-3 text-xs">
            <Lightbulb className="w-4 h-4 text-accent-deep shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <span className="font-semibold text-accent-deep">Evaluator Tip</span>
              <p className="text-ink-muted leading-relaxed">
                Committees often review candidates in rounds. Submitting at least 3 days before the deadline ensures transcripts and recommendations clear administrative intake without stress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
