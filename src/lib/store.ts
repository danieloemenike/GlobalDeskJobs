import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  description: string;
  companyWebsite: string;
  postedAt: string;
};

interface JobStore {
  jobs: Job[];
  savedJobs: string[];
  setJobs: (jobs: Job[]) => void;
  toggleSavedJob: (jobId: string) => void;
}

export const useJobStore = create<JobStore>()(
  persist(
    (set) => ({
      jobs: [],
      savedJobs: [],
      setJobs: (jobs) => set({ jobs }),
      toggleSavedJob: (jobId) =>
        set((state) => ({
          savedJobs: state.savedJobs.includes(jobId)
            ? state.savedJobs.filter((id) => id !== jobId)
            : [...state.savedJobs, jobId],
        })),
    }),
    {
      name: 'job-store',
    }
  )
);
