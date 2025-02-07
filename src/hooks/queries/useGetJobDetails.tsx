import { mockJobs } from '@/lib/data/job';
import { useQuery } from '@tanstack/react-query';


export function useJobDetailsQuery(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      const job = mockJobs.find(job => job.id === id);
      if (!job) throw new Error('Job not found');
      return job;
    },
  });
}