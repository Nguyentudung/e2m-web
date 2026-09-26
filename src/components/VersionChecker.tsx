import React, { useState } from 'react';
import { fetchUpdateInfo } from '../services/updateService';
import type { UpdateInfo, PlatformUpdateInfo } from '../types/update';
import { compareVersions } from '../utils/version';
import { Android, Apple } from './icons';

const CURRENT_VERSION_ANDROID = "1.0.0";
const CURRENT_VERSION_IOS = "1.0.0";

const PlatformChecker: React.FC<{
  title: string;
  currentVersion: string;
  platformInfo: PlatformUpdateInfo | undefined;
  icon: React.ReactNode;
}> = ({ title, currentVersion, platformInfo, icon }) => {
  if (!platformInfo) return null;

  if (!platformInfo.available) {
    return (
      <div className="py-4 border-b border-gray-100 dark:border-white/10 last:border-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500">
            {icon}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Chưa có bản phát hành</p>
          </div>
        </div>
      </div>
    );
  }

  const hasNewVersion = platformInfo.version ? compareVersions(currentVersion, platformInfo.version) > 0 : false;

  return (
    <div className="py-4 border-b border-gray-100 dark:border-white/10 last:border-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-700 dark:text-gray-200">
            {icon}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Phiên bản hiện tại: v{currentVersion}</p>
          </div>
        </div>
      </div>

      {!hasNewVersion ? (
        <div className="ml-13 text-sm text-gray-600 dark:text-gray-400">
          Đang sử dụng phiên bản mới nhất.
        </div>
      ) : (
        <div className="ml-13">
          <p className="text-sm font-medium text-primary mb-1">
            Đã có phiên bản mới: <span className="text-gray-900 dark:text-gray-100">v{platformInfo.version}</span>
          </p>
          
          {platformInfo.release_notes && platformInfo.release_notes.length > 0 && (
            <div className="mb-3 mt-2">
              <ul className="space-y-1">
                {platformInfo.release_notes.map((note, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-gray-400 dark:text-gray-600 mt-0.5">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a
            href={platformInfo.download_url || "#"}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-full transition-colors mt-2"
          >
            Cập nhật ngay
          </a>
        </div>
      )}
    </div>
  );
};

export const VersionChecker: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  const checkVersion = async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await fetchUpdateInfo();
      setUpdateInfo(info);
      setHasChecked(true);
    } catch (err) {
      setError('Không thể kiểm tra cập nhật. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-white/10 rounded-xl p-6 bg-white dark:bg-[#050505]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <p className="font-medium text-foreground">Trạng thái phiên bản</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Kiểm tra phiên bản mới nhất</p>
        </div>
        <button
          onClick={checkVersion}
          disabled={loading}
          className="px-4 py-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-white/10 text-sm font-medium rounded-full transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {loading ? 'Đang kiểm tra...' : 'Kiểm tra cập nhật'}
        </button>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {hasChecked && updateInfo && (
        <div className="mt-4 pt-2 border-t border-gray-100 dark:border-white/10">
          <PlatformChecker
            title="Android"
            currentVersion={CURRENT_VERSION_ANDROID}
            platformInfo={updateInfo.android}
            icon={<Android width="20" height="20" />}
          />
          <PlatformChecker
            title="iOS"
            currentVersion={CURRENT_VERSION_IOS}
            platformInfo={updateInfo.ios}
            icon={<Apple width="20" height="20" />}
          />
        </div>
      )}
    </div>
  );
};
