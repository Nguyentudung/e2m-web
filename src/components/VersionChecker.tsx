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
      setError('Không thể kiểm tra cập nhật. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Phiên bản hiện tại</p>
          <p className="font-medium text-foreground mt-0.5">v{CURRENT_VERSION}</p>
        </div>
        <button
          onClick={checkVersion}
          disabled={loading}
          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {loading ? 'Đang kiểm tra...' : 'Kiểm tra cập nhật'}
        </button>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {hasNewVersion === false && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
          Bạn đang sử dụng phiên bản mới nhất.
        </div>
      )}

      {hasNewVersion === true && updateInfo && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-primary mb-1">
            Đã có phiên bản mới
          </p>
          <p className="text-sm text-gray-600 mb-4">
            v{CURRENT_VERSION} → <span className="font-semibold text-foreground">v{updateInfo.version}</span>
          </p>
          
          {updateInfo.release_notes.length > 0 && (
            <div className="mb-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Chi tiết thay đổi</p>
              <ul className="space-y-1.5">
                {updateInfo.release_notes.map((note, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a
            href={updateInfo.download_url}
            className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
          >
            Cập nhật ngay
          </a>
        </div>
      )}
    </div>
  );
};
