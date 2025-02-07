// app/page.tsx
import { Loader2 } from "lucide-react";
import JobContents from "./_component/JobContents";
import { Suspense } from "react";


export default function Home() {
  

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold px-6">Unlock Your Perfect Remote Job, Hassle-Free</h1>
        <p className='text-base font-light'> Join a community where exceptional talents effortlessly connect with job opportunities.</p>
      </div>
      <hr />
      <Suspense 
        fallback={
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <JobContents />
        </Suspense>

    
    </div>
  );
}