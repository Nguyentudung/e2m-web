import React, { useEffect, useState } from 'react';
import { VersionChecker } from './components/VersionChecker';
import { fetchUpdateInfo } from './services/updateService';
import type { UpdateInfo } from './types/update';
import { Android, Apple } from './components/icons';

import logoSolid from './assets/logos/logo_solid.png';

function App() {
  const [latestUpdate, setLatestUpdate] = React.useState<UpdateInfo | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    fetchUpdateInfo().then(setLatestUpdate).catch(console.error);
    
    // Check initial theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background selection:bg-primary/20 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center relative h-16 w-32">
            {/* Colored logo, absolute positioned to not expand header */}
            <img 
              src={logoSolid} 
              alt="e2m Logo" 
              className="absolute top-1/2 left-0 -translate-y-1/2 h-16 sm:h-20 w-auto object-contain transition-all duration-300" 
            />
          </div>
          <nav className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              )}
            </button>
            <a 
              href="#download" 
              className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-full transition-colors"
            >
              Tải app
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <section className="py-24 text-center sm:text-left flex flex-col sm:items-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            e2m
          </h1>
          <p className="text-xl sm:text-2xl text-gray-800 dark:text-gray-200 font-medium mb-4">
            Easy Money Manager
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mb-10 sm:text-center">
            Quản lý tài chính cá nhân đơn giản và rõ ràng.
          </p>
          
          <div className="flex flex-col items-center gap-3">
            <a 
              href="#download" 
              className="inline-flex items-center justify-center px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-full transition-colors w-full sm:w-auto min-w-[200px]"
            >
              Tải e2m
            </a>
          </div>
        </section>

        {/* Download & Version Section */}
        <section id="download" className="py-12 border-t border-gray-100 dark:border-white/10">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Download Area */}
            <div>
              <h2 className="text-lg font-semibold mb-6 text-foreground">Tải e2m</h2>
              <div className="flex flex-col gap-4">
                {/* Android Download */}
                <div className="border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col h-full bg-white dark:bg-[#050505]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-700 dark:text-gray-200">
                      <Android width="24" height="24" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Android</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tải ứng dụng e2m cho Android</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                    {latestUpdate?.android?.available ? (
                      <>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">v{latestUpdate.android.version}</p>
                        <a 
                          href={latestUpdate.android.download_url || "#"} 
                          className="inline-flex items-center justify-center px-4 py-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-white/10 text-sm font-medium rounded-full transition-colors"
                        >
                          Tải cho Android
                        </a>
                      </>
                    ) : (
                      <p className="text-sm text-gray-400 dark:text-gray-500 italic">Chưa có bản phát hành</p>
                    )}
                  </div>
                </div>

                {/* iOS Download */}
                <div className="border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col h-full bg-white dark:bg-[#050505]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-700 dark:text-gray-200">
                      <Apple width="24" height="24" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">iOS</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tải ứng dụng e2m cho iPhone và iPad</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                    {latestUpdate?.ios?.available ? (
                      <>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">v{latestUpdate.ios.version}</p>
                        <a 
                          href={latestUpdate.ios.download_url || "#"} 
                          className="inline-flex items-center justify-center px-4 py-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-white/10 text-sm font-medium rounded-full transition-colors"
                        >
                          Tải cho iOS
                        </a>
                      </>
                    ) : (
                      <p className="text-sm text-gray-400 dark:text-gray-500 italic">Chưa có bản phát hành</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Version Check Area */}
            <div>
              <h2 className="text-lg font-semibold mb-6 text-foreground">Kiểm tra phiên bản</h2>
              <VersionChecker />
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100 dark:border-white/10 mt-auto relative overflow-hidden">
        {/* Giant background logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 dark:opacity-5">
          <img 
            src={logoSolid} 
            alt="e2m" 
            className="h-32 w-auto object-contain" 
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center justify-center relative z-10 h-full">
          <p className="text-sm text-gray-400 dark:text-gray-600">
            © 2026 e2m. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
