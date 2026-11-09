import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Application, ApplicationStatus, CookieConsent, Profile, Scholarship, ThemeMode } from '../types';
import { SCHOLARSHIPS } from '../data/scholarships';
import { initAnalytics } from './analytics';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function calculateProfileCompleteness(profile: Partial<Profile> | null | undefined): number {
  if (!profile) return 0;
  let score = 0;
  if (profile.name && profile.name.trim().length > 0) score += 10;
  if (profile.country && profile.country.trim().length > 0) score += 20;
  if (profile.level && profile.level.length > 0) score += 20;
  if (profile.field && profile.field.trim().length > 0) score += 20;
  if (profile.gpa !== undefined && !isNaN(profile.gpa)) score += 15;
  if (profile.financialNeed && profile.financialNeed.length > 0) score += 10;
  if (profile.interests && profile.interests.length > 0) score += 5;
  return Math.min(100, score);
}

const DEFAULT_PROFILE: Profile = {
  name: '',
  country: '',
  residencyCountry: '',
  level: '',
  field: '',
  gpa: undefined,
  gpaScale: 4.0,
  financialNeed: '',
  graduationYear: new Date().getFullYear() + 1,
  interests: [],
  completeness: 0,
};

// Safe storage wrapper that falls back to in-memory store if localStorage is blocked or throws
let memoryStorage: Record<string, string> = {};
let isStorageBlocked = false;

const safeStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
    } catch {
      isStorageBlocked = true;
      return memoryStorage[name] ?? null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch {
      isStorageBlocked = true;
      memoryStorage[name] = value;
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch {
      isStorageBlocked = true;
      delete memoryStorage[name];
    }
  },
};

export interface GrantlyStore {
  // State
  profile: Profile;
  applications: Record<string, Application>;
  savedScholarshipIds: string[];
  compareIds: string[];
  theme: ThemeMode;
  viewMode: 'grid' | 'list';
  cookieConsent: CookieConsent;
  toasts: ToastItem[];
  isStorageBlocked: boolean;

  // Actions
  updateProfile: (updates: Partial<Profile>) => void;
  resetProfile: () => void;

  addApplication: (scholarshipId: string) => Application | null;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  updateApplicationNotes: (id: string, notes: string) => void;
  toggleChecklistItem: (id: string, checklistId: string) => void;
  removeApplication: (id: string) => Application | null;
  restoreApplication: (app: Application) => void;

  toggleSaveScholarship: (scholarshipId: string) => boolean;
  toggleCompare: (scholarshipId: string) => boolean;
  clearCompare: () => void;

  setTheme: (theme: ThemeMode) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setCookieConsent: (consent: CookieConsent) => void;

  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;

  resetAllData: () => void;
  importUserData: (dataString: string) => { success: boolean; error?: string };
}

export const useGrantlyStore = create<GrantlyStore>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      applications: {},
      savedScholarshipIds: [],
      compareIds: [],
      theme: 'system',
      viewMode: 'grid',
      cookieConsent: null,
      toasts: [],
      isStorageBlocked,

      updateProfile: (updates) => {
        set((state) => {
          const merged = { ...state.profile, ...updates };
          merged.completeness = calculateProfileCompleteness(merged);
          return { profile: merged };
        });
      },

      resetProfile: () => {
        set({ profile: DEFAULT_PROFILE });
      },

      addApplication: (scholarshipId: string) => {
        const state = get();
        const existing = Object.values(state.applications).find((app) => app.scholarshipId === scholarshipId);
        if (existing) {
          get().addToast({
            title: 'Already in Tracker',
            message: 'This scholarship is already active in your application board.',
            variant: 'info',
          });
          return null;
        }

        const scholarship = SCHOLARSHIPS.find((s) => s.id === scholarshipId);
        if (!scholarship) return null;

        // Build default checklist items from documents and steps
        const checklist: Application['checklist'] = [
          ...scholarship.documentsRequired.map((doc, idx) => ({
            id: `doc-${idx}`,
            label: `Prepare: ${doc}`,
            done: false,
          })),
          ...scholarship.applicationSteps.map((step) => ({
            id: `step-${step.step}`,
            label: step.title,
            done: false,
          })),
        ];

        const newApp: Application = {
          id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          scholarshipId,
          status: 'saved',
          checklist,
          notes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((s) => ({
          applications: { ...s.applications, [newApp.id]: newApp },
          savedScholarshipIds: Array.from(new Set([...s.savedScholarshipIds, scholarshipId])),
        }));

        get().addToast({
          title: 'Added to Tracker',
          message: `${scholarship.title} added to Saved column.`,
          variant: 'success',
          action: {
            label: 'Undo',
            onClick: () => {
              get().removeApplication(newApp.id);
            },
          },
        });

        return newApp;
      },

      updateApplicationStatus: (id, status) => {
        set((state) => {
          const target = state.applications[id];
          if (!target) return state;
          const updated: Application = {
            ...target,
            status,
            updatedAt: new Date().toISOString(),
            submittedAt: status === 'submitted' || status === 'awarded' ? target.submittedAt || new Date().toISOString() : undefined,
          };
          return {
            applications: { ...state.applications, [id]: updated },
          };
        });
      },

      updateApplicationNotes: (id, notes) => {
        set((state) => {
          const target = state.applications[id];
          if (!target) return state;
          return {
            applications: {
              ...state.applications,
              [id]: { ...target, notes, updatedAt: new Date().toISOString() },
            },
          };
        });
      },

      toggleChecklistItem: (appId, checklistId) => {
        set((state) => {
          const app = state.applications[appId];
          if (!app) return state;
          const updatedChecklist = app.checklist.map((item) =>
            item.id === checklistId ? { ...item, done: !item.done } : item
          );
          return {
            applications: {
              ...state.applications,
              [appId]: { ...app, checklist: updatedChecklist, updatedAt: new Date().toISOString() },
            },
          };
        });
      },

      removeApplication: (id) => {
        const state = get();
        const target = state.applications[id];
        if (!target) return null;

        const nextApps = { ...state.applications };
        delete nextApps[id];

        set({ applications: nextApps });

        get().addToast({
          title: 'Application Removed',
          message: 'Scholarship removed from your tracker.',
          variant: 'info',
          action: {
            label: 'Undo',
            onClick: () => {
              get().restoreApplication(target);
            },
          },
        });

        return target;
      },

      restoreApplication: (app) => {
        set((state) => ({
          applications: { ...state.applications, [app.id]: app },
        }));
      },

      toggleSaveScholarship: (scholarshipId) => {
        const state = get();
        const isSaved = state.savedScholarshipIds.includes(scholarshipId);
        const scholarship = SCHOLARSHIPS.find((s) => s.id === scholarshipId);
        const title = scholarship ? scholarship.title : 'Scholarship';

        if (isSaved) {
          set({
            savedScholarshipIds: state.savedScholarshipIds.filter((id) => id !== scholarshipId),
          });
          get().addToast({
            title: 'Bookmark Removed',
            message: `${title} removed from bookmarks.`,
            variant: 'info',
            action: {
              label: 'Undo',
              onClick: () => {
                get().toggleSaveScholarship(scholarshipId);
              },
            },
          });
          return false;
        } else {
          set({
            savedScholarshipIds: [...state.savedScholarshipIds, scholarshipId],
          });
          get().addToast({
            title: 'Scholarship Saved',
            message: `${title} bookmarked.`,
            variant: 'success',
            action: {
              label: 'Undo',
              onClick: () => {
                get().toggleSaveScholarship(scholarshipId);
              },
            },
          });
          return true;
        }
      },

      toggleCompare: (scholarshipId) => {
        const state = get();
        const exists = state.compareIds.includes(scholarshipId);

        if (exists) {
          set({ compareIds: state.compareIds.filter((id) => id !== scholarshipId) });
          return false;
        }

        if (state.compareIds.length >= 3) {
          get().addToast({
            title: 'Comparison Limit',
            message: 'You can compare up to 3 scholarships side by side.',
            variant: 'warning',
          });
          return false;
        }

        set({ compareIds: [...state.compareIds, scholarshipId] });
        get().addToast({
          title: 'Added to Compare',
          message: `${state.compareIds.length + 1} of 3 scholarships selected.`,
          variant: 'info',
        });
        return true;
      },

      clearCompare: () => {
        set({ compareIds: [] });
      },

      setTheme: (theme) => {
        set({ theme });
        try {
          localStorage.setItem('grantly-theme', JSON.stringify(theme));
        } catch {}

        const root = document.documentElement;
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = theme === 'dark' || (theme === 'system' && systemDark);

        if (isDark) {
          root.classList.add('dark');
          const meta = document.getElementById('theme-color-meta');
          if (meta) meta.setAttribute('content', '#142019');
        } else {
          root.classList.remove('dark');
          const meta = document.getElementById('theme-color-meta');
          if (meta) meta.setAttribute('content', '#FAF7F0');
        }
      },

      setViewMode: (mode) => set({ viewMode: mode }),

      setCookieConsent: (consent) => {
        set({ cookieConsent: consent });
        if (consent === 'all') {
          initAnalytics();
        }
      },

      addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
        const newToast: ToastItem = { ...toast, id };
        set((state) => ({
          toasts: [...state.toasts.slice(-2), newToast], // Keep max 3 toasts
        }));

        const duration = toast.duration ?? 4500;
        if (duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, duration);
        }
        return id;
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      resetAllData: () => {
        set({
          profile: DEFAULT_PROFILE,
          applications: {},
          savedScholarshipIds: [],
          compareIds: [],
        });
        get().addToast({
          title: 'Data Reset Complete',
          message: 'All local profile and tracker records have been reset to defaults.',
          variant: 'info',
        });
      },

      importUserData: (dataString) => {
        try {
          const parsed = JSON.parse(dataString);
          if (!parsed || typeof parsed !== 'object') {
            return { success: false, error: 'Invalid JSON format.' };
          }

          const newProfile = parsed.profile ? { ...DEFAULT_PROFILE, ...parsed.profile } : get().profile;
          newProfile.completeness = calculateProfileCompleteness(newProfile);

          const newApplications = parsed.applications && typeof parsed.applications === 'object' ? parsed.applications : {};
          const newSaved = Array.isArray(parsed.savedScholarshipIds) ? parsed.savedScholarshipIds : [];

          set({
            profile: newProfile,
            applications: newApplications,
            savedScholarshipIds: newSaved,
          });

          get().addToast({
            title: 'Data Imported Successfully',
            message: `Loaded profile and ${Object.keys(newApplications).length} tracker applications.`,
            variant: 'success',
          });

          return { success: true };
        } catch {
          return { success: false, error: 'Could not parse import file. Please verify file integrity.' };
        }
      },
    }),
    {
      name: 'grantly-storage-v1',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            theme: persistedState.theme || 'system',
            compareIds: persistedState.compareIds || [],
          };
        }
        return persistedState as GrantlyStore;
      },
      partialize: (state) => ({
        profile: state.profile,
        applications: state.applications,
        savedScholarshipIds: state.savedScholarshipIds,
        compareIds: state.compareIds,
        theme: state.theme,
        viewMode: state.viewMode,
        cookieConsent: state.cookieConsent,
      }),
    }
  )
);
