 import { Job } from '@/lib/store';
import { mockJobs } from './data/job';
  
  interface FetchJobsParams {
    search?: string;
    location?: string;
    minSalary?: number;
    maxSalary?: number;
    page?: number;
    limit?: number;
  }
  
  interface PaginatedResponse<T> {
    data: T[];
    nextPage: number | null;
    totalPages: number;
    totalItems: number;
  }
  
  // Simulate API delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  export async function fetchJobs({
    search = '',
    location = '',
    minSalary = 0,
    maxSalary = 500000,
    page = 1,
    limit = 10
  }: FetchJobsParams = {}): Promise<PaginatedResponse<Job>> {
    // Simulate API delay
    await delay(100);
  
    // Filter jobs based on search criteria
    const filteredJobs = mockJobs.filter(job => {
      const matchesSearch = search
        ? job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.company.toLowerCase().includes(search.toLowerCase())
        : true;
  
      const matchesLocation = location
        ? job.location.toLowerCase().includes(location.toLowerCase())
        : true;
  
      const matchesSalary =
        job.salaryMax >= minSalary && job.salaryMin <= maxSalary;
  
      return matchesSearch && matchesLocation && matchesSalary;
    });
  
    // Calculate pagination
    const totalItems = filteredJobs.length;
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page < totalPages ? page + 1 : null;
  
    // Get paginated results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
  
    return {
      data: paginatedJobs,
      nextPage,
      totalPages,
      totalItems
    };
  }