// components/JobFilters.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Search, MapPin, DollarSign } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface JobFiltersProps {
  filters: {
    search: string;
    location: string;
    minSalary: number;
    maxSalary: number;
  };
  onFiltersChange: (filters: Partial<{
    search: string;
    location: string;
    minSalary: number;
    maxSalary: number;
  }>) => void;
}

export function JobFilters({ filters, onFiltersChange }: JobFiltersProps) {
  const debouncedSearchChange = useDebounce((value: string) => {
    onFiltersChange({ search: value });
  }, 300);

  const debouncedLocationChange = useDebounce((value: string) => {
    onFiltersChange({ location: value });
  }, 300);

  const debouncedSalaryChange = useDebounce((value: number[]) => {
    onFiltersChange({
      minSalary: value[0],
      maxSalary: value[1]
    });
  }, 300);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardDescription className='font-medium text-black'>
         Explore remote jobs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">Search </Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search jobs..."
              className="pl-9"
              defaultValue={filters.search}
              onChange={(e) => debouncedSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="Enter location..."
              className="pl-9"
              defaultValue={filters.location}
              onChange={(e) => debouncedLocationChange(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Salary Range</Label>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>
                {filters.minSalary.toLocaleString()} - {filters.maxSalary.toLocaleString()}
              </span>
            </div>
          </div>
          <Slider
            defaultValue={[filters.minSalary, filters.maxSalary]}
            max={500000}
            step={10000}
            onValueChange={(value) => debouncedSalaryChange(value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}