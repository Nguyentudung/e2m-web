import React from 'react';
import { VersionChecker } from './components/VersionChecker';
import { fetchUpdateInfo } from './services/updateService';
import type { UpdateInfo } from './types/update';

function App() {
  const [latestUpdate, setLatestUpdate] = React.useState<UpdateInfo | null>(null);

  React.useEffect(() => {
    // Fetch latest info for the primary download button
    fetchUpdateInfo().then(setLatestUpdate).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xl leading-none">
              e
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">e2m</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="#version" className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light transition-colors hidden sm:block">
              Phiên bản
            </a>
            <a 
              href={latestUpdate?.download_url || "#"} 
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-full transition-colors"
            >
              Tải e2m
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
                Easy Money <span className="text-primary">Manager</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Một ứng dụng quản lý tài chính cá nhân đơn giản, hiện đại và riêng tư. Giúp bạn kiểm soát chi tiêu dễ dàng hơn bao giờ hết.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a 
                  href={latestUpdate?.download_url || "#"} 
                  className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Tải APK Android
                </a>
                <a 
                  href="#version" 
                  className="w-full sm:w-auto px-8 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-foreground font-medium rounded-xl transition-colors text-center"
                >
                  Kiểm tra phiên bản
                </a>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Phiên bản mới nhất: <span className="font-semibold">{latestUpdate ? `v${latestUpdate.version}` : '...'}</span>
              </p>
            </div>

            <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center lg:justify-end">
              <div className="relative w-64 h-[500px] bg-slate-900 rounded-[2.5rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col">
                {/* Mockup Top */}
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-xl mx-16"></div>
                
                {/* Mockup Content */}
                <div className="flex-1 bg-gray-50 p-4 pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs text-gray-500">Tổng số dư</div>
                      <div className="text-xl font-bold text-slate-900">24.500.000 ₫</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">🍔</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">Ăn uống</div>
                        <div className="text-xs text-gray-500">Hôm nay</div>
                      </div>
                      <div className="text-sm font-bold text-red-500">-150.000</div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">🚕</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">Di chuyển</div>
                        <div className="text-xs text-gray-500">Hôm qua</div>
                      </div>
                      <div className="text-sm font-bold text-red-500">-50.000</div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">💰</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">Lương</div>
                        <div className="text-xs text-gray-500">15/09</div>
                      </div>
                      <div className="text-sm font-bold text-green-500">+15.000.000</div>
                    </div>
                  </div>
                </div>
                
                {/* Mockup Bottom Nav */}
                <div className="h-16 bg-white border-t flex items-center justify-around px-4">
                  <div className="text-primary flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  </div>
                  <div className="text-gray-400 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
                  </div>
                  <div className="text-gray-400 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Version Check Section */}
        <section id="version" className="py-20 bg-gray-50 dark:bg-slate-900/50 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Hệ thống cập nhật</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Kiểm tra phiên bản mới nhất và xem chi tiết những thay đổi.
              </p>
            </div>
            
            <VersionChecker />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 py-12 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-800 text-gray-500 flex items-center justify-center font-bold text-sm">
              e
            </div>
            <span className="font-semibold text-gray-600 dark:text-gray-400">e2m</span>
          </div>
          <p className="text-sm text-gray-500 text-center md:text-left">
            © 2026 e2m. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            <a href="#" className="hover:text-primary transition-colors">Liên hệ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
