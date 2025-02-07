'use client';

import { Job } from '@/lib/store';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, MapPin, DollarSign, BookmarkIcon, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useJobStore } from '@/lib/store';
import { cn, generateInitialsImage } from '@/lib/utils';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface JobCardProps {
  job: Job;
  onApply: () => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  const { savedJobs, toggleSavedJob } = useJobStore();
  const isSaved = savedJobs.includes(job.id);
  const initialsImage = generateInitialsImage(job.company);
  const timeAgo = formatDistanceToNow(parseISO(job.postedAt), { addSuffix: true });

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={initialsImage} alt={`${job.company} logo`} />
          <AvatarFallback className="text-lg">
            {job.company.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold leading-none mb-1">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault(); // Prevent link navigation when clicking bookmark
                toggleSavedJob(job.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
            >
              <BookmarkIcon
                className={cn(
                  'h-5 w-5',
                  isSaved ? 'fill-primary text-primary' : 'fill-none'
                )}
              />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          <Badge variant="secondary" className="flex items-center gap-1 justify-center p-2">
            <MapPin className="h-3 w-3" />
            {job.location}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1 justify-center">
            <DollarSign className="h-3 w-3" />
            {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1 justify-center">
            <Calendar className="h-3 w-3" />
            {timeAgo}
          </Badge>
        </div>
        {job.description && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {job.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline" className="" asChild>
          <Link href={`/jobs/${job.id}`}>View Details</Link>
        </Button>
        <Button className="" onClick={(e) => {
          e.preventDefault(); // Prevent link navigation when clicking apply
          onApply();
        }}>
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
}