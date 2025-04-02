"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTestStore } from "@/app/shared/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./shared/components/ui/Card";
import { Button } from "./shared/components/ui/Button";
import { openDashboardInPWA, isPWA } from "./shared/lib/pwa";

export default function Home() {
  const { tests, setActiveTest } = useTestStore();
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    setActiveTest(null);
    
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
    });
    
    // Check if already installed
    if (isPWA()) {
      setIsPWAInstalled(true);
    } else {
      // Also check for display-mode
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      setIsPWAInstalled(mediaQuery.matches);
      
      // Listen for changes
      mediaQuery.addEventListener('change', (e) => {
        setIsPWAInstalled(e.matches);
      });
    }
  }, [setActiveTest]);

  const handleOpenDashboard = () => {
    openDashboardInPWA();
  };
  
  const handleInstallClick = () => {
    if (!deferredPrompt) {
      // If we can't install via the API, open the dashboard anyway
      window.location.href = '/dashboard';
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsPWAInstalled(true);
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the saved prompt
      setDeferredPrompt(null);
    });
  };

  return (
    <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Online Test Assessment Platform</h1>
        <p className="text-gray-600 mb-6">Create and take online assessments with ease</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/create">
            <Button variant="primary" size="lg">Create New Test</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">View Analytics</Button>
          </Link>
          {!isPWA() && (
            <Button 
              variant="outline" 
              size="lg" 
              onClick={isPWAInstalled ? handleOpenDashboard : handleInstallClick}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
            >
              {isPWAInstalled ? "Open in App" : "Install App"}
            </Button>
          )}
        </div>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Available Tests</h2>
        
        {tests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-500">No tests available</h3>
            <p className="text-gray-400 mt-2">Create your first test to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <Card key={test.id} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{test.title}</CardTitle>
                  <CardDescription>
                    {test.description || "No description provided"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    {test.questions.length} question{test.questions.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {new Date(test.createdAt).toISOString().split('T')[0]}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/take/${test.id}`}>
                    <Button variant="primary" size="sm">Take Test</Button>
                  </Link>
                  <Link href={`/edit/${test.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
