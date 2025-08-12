// src/hooks/useProspectImage.js
import { useState, useEffect } from 'react';
import { getProspectImageUrl } from '@/services/imageService.js';

export const useProspectImage = (prospectName, prospectImageUrl) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      setIsLoading(true);
      const url = await getProspectImageUrl(prospectName, prospectImageUrl);
      if (isMounted) {
        setImageUrl(url);
        setIsLoading(false);
      }
    };

    fetchImage();
    return () => { isMounted = false; };
  }, [prospectName, prospectImageUrl]);

  return { imageUrl, isLoading };
};

export default useProspectImage;  