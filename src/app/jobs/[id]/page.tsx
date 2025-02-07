'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { use, useState } from 'react';
import { Building2, MapPin, DollarSign, Calendar, Globe, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApplicationForm } from '@/app/_component/ApplicationForm';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { generateInitialsImage } from '@/lib/utils';
import { useJobDetailsQuery } from '@/hooks/queries/useGetJobDetails';

export default function JobDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const resolvedParams = use(params);
    const { data: job, isLoading, isError } = useJobDetailsQuery(resolvedParams?.id);

    if (isLoading) {
        return (
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
      }
    
      if (isError || !job) {
        notFound();
      }
    

  const initialsImage = generateInitialsImage(job.company);
  const postedDate = parseISO(job.postedAt);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2 pl-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={initialsImage} alt={`${job.company} logo`} />
                <AvatarFallback className="text-2xl">
                  {job.company.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                  </div>
                  <div className="hidden md:flex gap-3">
                    <Button onClick={() => setIsDialogOpen(true)}>
                      Apply Now
                    </Button>
                    <Button variant="outline" asChild>
                      <a
                        href={job.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        Company Site
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Badge variant="secondary" className="flex items-center gap-2 h-9 px-4 justify-center">
                <MapPin className="h-4 w-4" />
                {job.location}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2 h-9 px-4 justify-center">
                <DollarSign className="h-4 w-4" />
                ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2 h-9 px-4 justify-center">
                <Calendar className="h-4 w-4" />
                Posted {timeAgo}
              </Badge>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">About the Role</h2>
              <div className="whitespace-pre-line text-[14px] font-normal">{job.description}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="sticky bottom-4 p-4 md:hidden">
          <div className="flex justify-between items-center gap-4">
            <div>
              <p className="font-semibold">{job.title}</p>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              Apply Now
            </Button>
          </div>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl h-[80dvh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {job.title} at {job.company}
            </DialogTitle>
          </DialogHeader>
          <ApplicationForm
            job={job}
            onSuccess={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}