'use client';

import { useEffect } from 'react';
import { axiosInstence } from '@/utils/fetch';
import { getToken } from '@/utils/Auth';

interface ViewRecorderProps {
  postId: string;
}

const ViewRecorder = ({ postId }: ViewRecorderProps) => {
  useEffect(() => {
    const recordView = async () => {
      try {
        // Check if user is authenticated before recording view
        const token = await getToken();
        
        if (token) {
          await axiosInstence.post(`/v1/posts/${postId}/view`, null, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      } catch (error) {
        // Silently fail view recording to avoid disrupting user experience
        console.error('Failed to record view:', error);
      }
    };

    recordView();
  }, [postId]);

  // This component doesn't render anything visible
  return null;
};

export default ViewRecorder;