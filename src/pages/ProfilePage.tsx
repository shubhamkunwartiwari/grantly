import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Download, Upload, RotateCcw, CheckCircle2, ArrowRight, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGrantlyStore } from '../lib/store';
import { StudyLevel, FinancialNeedType } from '../types';
import { Button } from '../components/ui/Button';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const profile = useGrantlyStore((state) => state.profile);
  const updateProfile = useGrantlyStore((state) => state.updateProfile);
  const resetAllData = useGrantlyStore((state) => state.resetAllData);
  const importUserData = useGrantlyStore((state) => state.importUserData);
  const applications = useGrantlyStore((state) => state.applications);
  const savedScholarshipIds = useGrantlyStore((state) => state.savedScholarshipIds);
  const addToast = useGrantlyStore((state) => state.addToast);

  const [activeStep, setActiveStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  usePageMeta({
    title: 'Eligibility Profile & Data Settings | Grantly',
    description:
      'Manage your academic credentials, GPA, citizenship, and local data export/import settings.',
  });

  const STEPS = [
    { step: 1, title: 'Citizenship & Level', subtitle: 'Geographic and academic stage' },
    { step: 2, title: 'Field & Academics', subtitle: 'Discipline and optional GPA' },
    { step: 3, title: 'Financial Need & Goals', subtitle: 'Need alignment and focus tags' },
    { step: 4, title: 'Summary & Data', subtitle: 'Review and local backup tools' },
  ];

  const handleExportData = () => {
    const exportObject = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      applications,
      savedScholarshipIds,
    };
    const jsonStr = JSON.stringify(exportObject, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `grantly-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast({
      title: 'Data Exported',
      message: 'Your profile and application tracker records have been saved as JSON.',
      variant: 'success',
    });
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importUserData(content);
      if (!res.success) {
        addToast({
          title: 'Import Failed',
          message: res.error || 'Invalid backup format.',
          variant: 'error',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const POPULAR_FIELDS = [
    'Computer Science',
    'Engineering & Technology',
    'Medicine & Health',
    'Environmental Science',
    'Architecture',
    'Fine Arts',
    'Public Policy',
    'Law',
    'Economics',
    'Mathematics',
  ];

  const INTEREST_TAGS = [
    'Climate Tech',
    'AI Safety',
    'Public Health',
    'Open Source',
    'Robotics',
    'First Generation',
    'Indigenous Studies',
    'Clean Water',
    'Bioinformatics',
    'Urban Planning',
  ];

  const toggleInterest = (tag: string) => {
    const current = profile.interests || [];
    if (current.includes(tag)) {
      updateProfile({ interests: current.filter((t) => t !== tag) });
    } else {
      updateProfile({ interests: [...current, tag] });
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 md:py-12 w-full space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-hairline">
        <div>
          <div className="text-xs font-mono text-ink-muted mb-1">
            Eligibility Configuration
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-ink-primary font-normal tracking-tight">
            Student Profile
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Used purely to compute verified match percentages. Stored 100% on your local machine.
          </p>
        </div>

        {/* Completeness Badge */}
        <div className="flex items-center gap-3 p-3 bg-surface-card border border-border-hairline rounded-[14px]">
          <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center font-serif text-base font-bold text-brand-primary">
            {profile.completeness}%
          </div>
          <div>
            <div className="text-xs font-semibold text-ink-primary">Profile Completeness</div>
            <div className="text-[11px] text-ink-muted">
              {profile.completeness >= 80 ? 'Optimal match accuracy' : 'Add details for better matches'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Multi-step Progress Bar */}
      <nav aria-label="Profile onboarding stages" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {STEPS.map((s) => {
          const isCurrent = activeStep === s.step;
          const isPassed = activeStep > s.step;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step)}
              className={`text-left p-3 rounded-[10px] border transition-colors ${
                isCurrent
                  ? 'bg-surface-card border-brand-primary text-brand-primary shadow-xs'
                  : isPassed
                  ? 'bg-surface-raised/80 border-border-subtle text-ink-primary'
                  : 'bg-surface-raised/40 border-border-subtle text-ink-muted'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[11px] mb-0.5">
                <span>Stage 0{s.step}</span>
                {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />}
              </div>
              <div className="font-serif text-xs sm:text-sm font-medium truncate">{s.title}</div>
            </button>
          );
        })}
      </nav>

      {/* 3. Step Content Cards */}
      <div className="bg-surface-card border border-border-hairline rounded-[16px] p-6 sm:p-8 space-y-6">
        {/* STEP 1: Citizenship & Level */}
        {activeStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-ink-primary mb-1">
                Citizenship & Academic Level
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted">
                Many government and foundation endowments require verified national citizenship or degree levels.
              </p>
            </div>

            {/* Name (Optional) */}
            <div>
              <label htmlFor="student-name" className="block text-xs font-medium text-ink-primary mb-1.5">
                Preferred Name (Optional)
              </label>
              <input
                id="student-name"
                type="text"
                value={profile.name || ''}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="e.g. Maya Lin"
                className="w-full max-w-md px-3.5 py-2.5 text-sm bg-surface-raised border border-border-subtle rounded-[8px] text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            {/* Citizenship Country */}
            <div>
              <div className="flex items-center justify-between max-w-md mb-1.5">
                <label htmlFor="country-citizenship" className="text-xs font-medium text-ink-primary">
                  Country of Citizenship
                </label>
                <span className="text-[11px] text-ink-muted">Why we ask: geographic rules</span>
              </div>
              <input
                id="country-citizenship"
                type="text"
                value={profile.country || ''}
                onChange={(e) => updateProfile({ country: e.target.value })}
                placeholder="e.g. United States, India, Canada, United Kingdom, Brazil, Kenya..."
                className="w-full max-w-md px-3.5 py-2.5 text-sm bg-surface-raised border border-border-subtle rounded-[8px] text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            {/* Academic Level */}
            <div>
              <div className="flex items-center justify-between max-w-md mb-2">
                <label className="text-xs font-medium text-ink-primary">
                  Current / Target Study Level
                </label>
                <span className="text-[11px] text-ink-muted">Required for stage checks</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
                {[
                  { value: 'high_school', label: 'High School' },
                  { value: 'undergraduate', label: 'Undergraduate' },
                  { value: 'postgraduate', label: 'Postgraduate (Masters)' },
                  { value: 'phd', label: 'Doctoral (PhD)' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateProfile({ level: opt.value as StudyLevel })}
                    className={`p-3 text-xs font-medium rounded-[10px] border transition-colors text-center ${
                      profile.level === opt.value
                        ? 'bg-brand-primary text-brand-contrast border-brand-primary'
                        : 'bg-surface-raised text-ink-primary border-border-subtle hover:border-brand-primary/40'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Field & Academics */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-ink-primary mb-1">
                Field of Study & Academic Record
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted">
                Match specialized departmental bursaries and check minimum GPA cutoffs.
              </p>
            </div>

            {/* Field / Major */}
            <div>
              <label htmlFor="student-field" className="block text-xs font-medium text-ink-primary mb-1.5">
                Primary Major / Field of Study
              </label>
              <input
                id="student-field"
                type="text"
                value={profile.field || ''}
                onChange={(e) => updateProfile({ field: e.target.value })}
                placeholder="e.g. Computer Science, Mechanical Engineering, Fine Arts..."
                className="w-full max-w-md px-3.5 py-2.5 text-sm bg-surface-raised border border-border-subtle rounded-[8px] text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-primary mb-2"
              />

              {/* Quick suggestion tags */}
              <div className="flex flex-wrap items-center gap-1.5 max-w-xl">
                {POPULAR_FIELDS.map((field) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => updateProfile({ field })}
                    className="text-[11px] px-2 py-1 rounded bg-surface-raised hover:bg-brand-light hover:text-brand-primary border border-border-subtle transition-colors"
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>

            {/* GPA and GPA Scale */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
              <div>
                <label htmlFor="student-gpa" className="block text-xs font-medium text-ink-primary mb-1.5">
                  Cumulative GPA (Optional)
                </label>
                <input
                  id="student-gpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={profile.gpa ?? ''}
                  onChange={(e) =>
                    updateProfile({
                      gpa: e.target.value === '' ? undefined : parseFloat(e.target.value),
                    })
                  }
                  placeholder="e.g. 3.65"
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-raised border border-border-subtle rounded-[8px] text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label htmlFor="student-scale" className="block text-xs font-medium text-ink-primary mb-1.5">
                  Grading Scale
                </label>
                <select
                  id="student-scale"
                  value={profile.gpaScale || 4.0}
                  onChange={(e) => updateProfile({ gpaScale: parseFloat(e.target.value) })}
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-raised border border-border-subtle rounded-[8px] text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
                >
                  <option value={4.0}>4.0 Scale (US / Standard)</option>
                  <option value={10.0}>10.0 Scale (India CGPA)</option>
                  <option value={100}>100% Percentage</option>
                  <option value={5.0}>5.0 Scale</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Financial Need & Focus Tags */}
        {activeStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-ink-primary mb-1">
                Financial Need & Key Interests
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted">
                Some programs prioritize demonstrated financial need; others are strictly merit-based.
              </p>
            </div>

            {/* Need Choice */}
            <div>
              <label className="block text-xs font-medium text-ink-primary mb-2">
                Financial Need Status
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
                {[
                  {
                    value: 'required',
                    title: 'High / Pell Eligible',
                    desc: 'Family income requires significant tuition backing',
                  },
                  {
                    value: 'considered',
                    title: 'Moderate Need',
                    desc: 'Assistance helpful but not solely dependent',
                  },
                  {
                    value: 'none',
                    title: 'Merit-Only Focus',
                    desc: 'Seeking awards based purely on research or talent',
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateProfile({ financialNeed: opt.value as FinancialNeedType })}
                    className={`p-3.5 rounded-[10px] border text-left transition-colors ${
                      profile.financialNeed === opt.value
                        ? 'bg-brand-primary text-brand-contrast border-brand-primary shadow-xs'
                        : 'bg-surface-raised text-ink-primary border-border-subtle hover:border-brand-primary/40'
                    }`}
                  >
                    <div className="font-semibold text-xs mb-1">{opt.title}</div>
                    <div className="text-[11px] opacity-80 leading-normal">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Research / Personal Interests */}
            <div>
              <label className="block text-xs font-medium text-ink-primary mb-2">
                Interest & Cause Focus Areas
              </label>
              <div className="flex flex-wrap items-center gap-2 max-w-xl">
                {INTEREST_TAGS.map((tag) => {
                  const isSelected = (profile.interests || []).includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      className={`px-3 py-1.5 rounded-[8px] text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-brand-light text-brand-primary border-brand-primary/30 font-semibold'
                          : 'bg-surface-raised text-ink-muted border-border-subtle hover:text-ink-primary'
                      }`}
                    >
                      {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Summary & Data Management Tools */}
        {activeStep === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-ink-primary mb-1">
                Profile Summary & Data Ownership
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted">
                Your data is stored locally. You can export JSON backups, restore records, or reset anytime.
              </p>
            </div>

            {/* Overview Card */}
            <div className="p-5 bg-surface-raised/70 border border-border-subtle rounded-[14px] space-y-3">
              <h3 className="font-serif text-base text-ink-primary">Active Profile Snapshot</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-ink-muted block text-[11px]">Citizenship</span>
                  <span className="font-semibold text-ink-primary">{profile.country || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[11px]">Degree Level</span>
                  <span className="font-semibold text-ink-primary capitalize">{profile.level?.replace('_', ' ') || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[11px]">Major / Field</span>
                  <span className="font-semibold text-ink-primary">{profile.field || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[11px]">GPA</span>
                  <span className="font-semibold text-ink-primary font-mono">{profile.gpa ? `${profile.gpa} / ${profile.gpaScale || 4.0}` : 'No GPA set'}</span>
                </div>
              </div>
            </div>

            {/* Data Export / Import / Reset Section */}
            <div className="pt-4 border-t border-border-subtle space-y-4">
              <h3 className="font-serif text-base text-ink-primary">Local Data Management</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportData}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Export my data (JSON)
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                >
                  Import data backup
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleImportFile}
                />

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (window.confirm('Reset all saved scholarships, tracker boards, and profile details to initial state?')) {
                      resetAllData();
                    }
                  }}
                  className="text-semantic-danger hover:bg-semantic-danger-bg hover:text-semantic-danger"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Reset all records
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Back / Next Nav Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
          {activeStep > 1 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setActiveStep(activeStep - 1)}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Previous stage
            </Button>
          ) : (
            <div />
          )}

          {activeStep < 4 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveStep(activeStep + 1)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Continue to stage 0{activeStep + 1}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/discover')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Explore matched scholarships
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
