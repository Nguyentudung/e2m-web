import React from 'react';
import { VersionChecker } from './components/VersionChecker';
import { fetchUpdateInfo } from './services/updateService';
import type { UpdateInfo } from './types/update';

import logoSolid from './assets/logos/logo_solid.png';

function App() {
  const [latestUpdate, setLatestUpdate] = React.useState<UpdateInfo | null>(null);

  React.useEffect(() => {
    fetchUpdateInfo().then(setLatestUpdate).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <img src={logoSolid} alt="e2m Logo" className="h-8 w-auto object-contain" />
          </div>
          <nav>
            <a 
              href={latestUpdate?.download_url || "#"} 
              className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
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
          <p className="text-xl sm:text-2xl text-gray-800 font-medium mb-4">
            Easy Money Manager
          </p>
          <p className="text-lg text-gray-500 max-w-lg mb-10 sm:text-center">
            Quản lý tài chính cá nhân đơn giản và rõ ràng.
          </p>
          
          <div className="flex flex-col items-center gap-3">
            <a 
              href={latestUpdate?.download_url || "#"} 
              className="inline-flex items-center justify-center px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors w-full sm:w-auto min-w-[200px]"
            >
              Tải e2m
            </a>
            <p className="text-sm text-gray-500">
              Phiên bản mới nhất: <span className="font-medium text-gray-700">{latestUpdate ? `v${latestUpdate.version}` : '...'}</span>
            </p>
          </div>
        </section>

        {/* Download & Version Section */}
        <section className="py-12 border-t border-gray-100">
          <div className="grid sm:grid-cols-2 gap-12">
            
            {/* Download Area */}
            <div>
              <h2 className="text-lg font-semibold mb-6">Tải e2m</h2>
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-foreground">Android</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Phiên bản mới nhất: v{latestUpdate?.version || '...'}
                    </p>
                  </div>
                </div>
                <a 
                  href={latestUpdate?.download_url || "#"} 
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 font-medium rounded-lg transition-colors"
                >
                  Tải APK
                </a>
              </div>
            </div>

            {/* Version Check Area */}
            <div>
              <h2 className="text-lg font-semibold mb-6">Phiên bản</h2>
              <VersionChecker />
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100 mt-auto">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-2">
          <div className="flex items-center justify-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
            <img src={logoSolid} alt="e2m" className="h-5 w-auto object-contain" />
          </div>
          <p className="text-sm text-gray-400">
            © 2026 e2m. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
