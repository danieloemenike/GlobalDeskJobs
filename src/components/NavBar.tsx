'use client';

import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-10">
        <Link href="/" className="text-xl font-bold  ">
       <span className="text-[#4F46E5] dark:text-white"> Global</span> HQ
        </Link>
        <ModeToggle />
      </div>
    </nav>
  );
}