import type { UpdateInfo } from '../types/update';

export const fetchUpdateInfo = async (): Promise<UpdateInfo> => {
  try {
    const response = await fetch('/download/update.json', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: UpdateInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch update info:', error);
    throw error;
  }
};
