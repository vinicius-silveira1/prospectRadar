// src/hooks/useProspectImage.js
import { useState, useEffect } from 'react';
import { getProspectImageUrl } from '@/services/imageService.js';

export const useProspectImage = (prospect) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      if (!prospect) return;
      setIsLoading(true);
      const url = await getProspectImageUrl(prospect);
      if (isMounted) {
        setImageUrl(url);
        setIsLoading(false);
      }
    };

    fetchImage();
    return () => { isMounted = false; };
  }, [prospect]);

  return { imageUrl, isLoading };
};