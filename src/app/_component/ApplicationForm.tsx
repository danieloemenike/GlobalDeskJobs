'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Job } from '@/lib/store';
import { useState } from 'react';
import { fileToBase64 } from '@/lib/utils';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Full name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  resume: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Resume is required')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      'File size should be less than 5MB'
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      'Only PDF and DOCX files are accepted'
    ),
  coverLetter: z.string().min(20, {
    message: 'Cover letter must be at least 20 characters.',
  }),
});
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

interface ApplicationFormProps {
  job: Job;
  onSuccess: () => void;
}

export function ApplicationForm({ onSuccess }: ApplicationFormProps) {
  const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
        coverLetter: '',
        resume: undefined,
    },
  });

  type FormValues = z.infer<typeof formSchema>;
  
  const {
      formState: { isValid, dirtyFields }
    } = form;
  
      // Check if all fields are dirty (have been touched/modified)
      const allFieldsDirty = Object.keys(formSchema.shape).every(
        (key) => dirtyFields[key as keyof FormValues]
      );
  
      const isButtonDisabled = !isValid || !allFieldsDirty || isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
      console.log(values);
      setIsSubmitting(true);
    try {
      // Convert file to base64
      const file = values.resume[0];
      const base64 = await fileToBase64(file);

      // Log the form data and base64 file
      console.log('Form submission:', {
        ...values,
        resume: {
          name: file.name,
          type: file.type,
          size: file.size,
          base64: base64,
        },
      });

      // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast({title:'Application submitted successfully!', variant: 'default', });
      onSuccess();
    } catch (error) {
      toast({title:'Error submitting form!', variant: 'destructive', });
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Please enter a valid email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
              />
                <FormField
          control={form.control}
          name="resume"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Resume</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".pdf,.docx"
                    className="file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:cursor-pointer hover:file:bg-primary/90 cursor-pointer"
                    onChange={(e) => {
                      onChange(e.target.files);
                    }}
                    {...{ ...field, value: undefined }}
                  />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
              </FormControl>
              <p className="text-sm text-muted-foreground">
                Maximum file size: 5MB. Accepted formats: PDF, DOCX
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us why you're interested in this position..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Minimum 100 characters. Be specific about your relevant experience
                and why you&apos;re a good fit.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" className="w-full"   disabled={isButtonDisabled} >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Application'
                      ) }
          </Button>
         
        </div>
        {!allFieldsDirty && (
          <p className="text-sm text-muted-foreground text-center">
            Please fill in all fields to submit
          </p>
        )}
      </form>
    </Form>
  );
}