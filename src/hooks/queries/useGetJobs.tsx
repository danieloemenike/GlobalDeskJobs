import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchJobs } from '@/lib/api';

interface UseJobsQueryParams {
  search?: string;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
  limit?: number;
}

export function useJobsQuery({
  search,
  location,
  minSalary,
  maxSalary,
  limit = 10
}: UseJobsQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: ['jobs', { search, location, minSalary, maxSalary }],
    queryFn: ({ pageParam = 1 }) =>
      fetchJobs({
        search,
        location,
        minSalary,
        maxSalary,
        page: pageParam,
        limit
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    getPreviousPageParam: () => undefined, // We're only implementing forward pagination
  });
}