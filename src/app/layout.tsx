import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Providers } from "@/components/Provider";
import { Navbar } from "@/components/NavBar";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Job Board - Find Your Dream Job',
  description: 'Browse and apply for the latest job opportunities',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
               <Toaster />
          <Providers>
           <NuqsAdapter>
          <div className="min-h-screen bg-background">
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">
                  { children }
                </main>
          </div>
       
            
          </NuqsAdapter>
          </Providers>
          </ThemeProvider>
      </body>
    </html>
  );
}

