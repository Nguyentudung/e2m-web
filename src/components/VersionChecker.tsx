import React, { useState } from 'react';
import { fetchUpdateInfo } from '../services/updateService';
import type { UpdateInfo } from '../types/update';
import { compareVersions } from '../utils/version';

const CURRENT_VERSION = "1.0.0";

export const VersionChecker: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasNewVersion, setHasNewVersion] = useState<boolean | null>(null);

  const checkVersion = async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await fetchUpdateInfo();
      setUpdateInfo(info);
      
      const comparison = compareVersions(CURRENT_VERSION, info.version);
      setHasNewVersion(comparison > 0);
    } catch (err) {
      setError('Không thể kiểm tra phiên bản. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-surface border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 max-w-xl mx-auto shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Phiên bản hiện tại</h3>
          <p className="text-gray-500 dark:text-gray-400">v{CURRENT_VERSION}</p>
        </div>
        <button
          onClick={checkVersion}
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-foreground font-medium rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? 'Đang kiểm tra...' : 'Kiểm tra phiên bản'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm mb-4">
          {error}
        </div>
      )}

      {hasNewVersion === false && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl text-sm mb-4">
          Bạn đang sử dụng phiên bản mới nhất.
        </div>
      )}

      {hasNewVersion === true && updateInfo && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-5 bg-primary/10 border border-primary/20 rounded-xl mb-6">
            <h4 className="text-primary-dark dark:text-primary-light font-semibold mb-2">
              Đã có phiên bản mới: v{updateInfo.version}
            </h4>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tính năng mới:</p>
              <ul className="list-disc pl-5 space-y-1">
                {updateInfo.release_notes.map((note, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400">{note}</li>
                ))}
              </ul>
            </div>

            <a
              href={updateInfo.download_url}
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors"
            >
              Tải phiên bản mới
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
