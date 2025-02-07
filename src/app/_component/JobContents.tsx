"use client";
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Job } from '@/lib/store';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useJobsQuery } from '@/hooks/queries/useGetJobs';
import { JobFilters } from './JobFilters';
import { JobCard } from './JobCard';
import { ApplicationForm } from './ApplicationForm';
export default function JobContents() {
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { ref, inView } = useInView();

  // URL query states
  const [queryStates, setQueryStates] = useQueryStates({
    search: parseAsString.withDefault(''),
    location: parseAsString.withDefault(''),
    minSalary: parseAsInteger.withDefault(0),
    maxSalary: parseAsInteger.withDefault(500000),
  }, {
    history: 'replace',
    shallow: true,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useJobsQuery({
    search: queryStates.search,
    location: queryStates.location,
    minSalary: queryStates.minSalary,
    maxSalary: queryStates.maxSalary,
  });

  // Load more when the last item comes into view
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  // Flatten all pages of jobs into a single array
  const jobs = data?.pages.flatMap(page => page.data) ?? [];

  const handleFiltersChange = async (updates: Partial<typeof queryStates>) => {
    await setQueryStates((prev) => ({
      ...prev,
      ...updates
    }));
    refetch(); // Refetch when filters change
  };

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );
  }
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
                    <JobFilters
                        filters={ queryStates }
                        onFiltersChange={ handleFiltersChange }
                    />
                </div>
                <div className="lg:col-span-3">
                    { isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            { jobs.map((job) => (
                                <JobCard
                                    key={ job.id }
                                    job={ job }
                                    onApply={ () => {
                                        setSelectedJob(job);
                                        setIsDialogOpen(true);
                                    } }
                                />
                            )) }
                            { isFetchingNextPage && (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) }
                            <div ref={ ref } className="h-px" />
                        </div>
                    ) }
                    { jobs.length === 0 && !isLoading && (
                        <div className="text-center py-8 text-muted-foreground">
                            No jobs found matching your criteria
                        </div>
                    ) }
                </div>
            </div>
            <Dialog open={ isDialogOpen } onOpenChange={ setIsDialogOpen }>
                <DialogContent className="max-w-[90dvw] md:max-w-2xl h-[80dvh] overflow-y-scroll">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            { selectedJob?.title } at { selectedJob?.company }
                        </DialogTitle>
                    </DialogHeader>
                    { selectedJob && (
                        <ApplicationForm
                            job={ selectedJob }
                            onSuccess={ () => setIsDialogOpen(false) }
                        />
                    ) }
                </DialogContent>
            </Dialog>
        </>
    )
}