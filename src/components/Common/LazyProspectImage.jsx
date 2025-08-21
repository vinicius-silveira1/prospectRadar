import { useState, useEffect, useRef, useCallback } from 'react';
import { User } from 'lucide-react';

import { getInitials, getColorFromName } from '../../utils/imageUtils.js';

const LazyProspectImage = ({ 
  prospect, 
  className = "w-16 h-16 rounded-full object-cover",
  fallbackClassName = "w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center",
  eager = false 
}) => {
  const [imageState, setImageState] = useState({
    currentUrl: null,
    isLoading: true,
    hasError: false,
    isIntersecting: false
  });
  
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer para lazy loading
  const observerCallback = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !imageState.isIntersecting) {
      setImageState(prev => ({ ...prev, isIntersecting: true }));
    }
  }, [imageState.isIntersecting]);

  // Setup Intersection Observer
  useEffect(() => {
    if (eager) {
      setImageState(prev => ({ ...prev, isIntersecting: true }));
      return;
    }

    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(observerCallback, {
      rootMargin: '50px', // Start loading 50px before element is visible
      threshold: 0.1
    });

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current && imgRef.current) {
        observerRef.current.unobserve(imgRef.current);
      }
    };
  }, [observerCallback, eager]);

  // Load image when intersecting
  useEffect(() => {
    if (!imageState.isIntersecting) return;

    const loadImage = async () => {
      try {
        setImageState(prev => ({ ...prev, isLoading: true, hasError: false }));
        const imageUrl = `https://via.placeholder.com/150?text=${prospect.name}`; // Placeholder
        setImageState(prev => ({ 
          ...prev, 
          currentUrl: imageUrl, 
          isLoading: false 
        }));
      } catch (error) {
        console.error('Error loading image:', error);
        setImageState(prev => ({ 
          ...prev, 
          hasError: true, 
          isLoading: false 
        }));
      }
    };

    loadImage();
  }, [imageState.isIntersecting, prospect.name, prospect.id]);

  // Loading state
  if (!imageState.isIntersecting || imageState.isLoading) {
    return (
      <div 
        ref={imgRef}
        className={fallbackClassName}
        style={{ 
          backgroundColor: getColorFromName(prospect.name || 'Unknown'),
          opacity: imageState.isIntersecting ? 0.7 : 1
        }}
      >
        {imageState.isIntersecting ? (
          <div className="animate-pulse w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full" />
        ) : (
          <span className="text-white font-semibold text-sm">
            {getInitials(prospect.name || 'UN')}
          </span>
        )}
      </div>
    );
  }

  // Error state
  if (imageState.hasError || !imageState.currentUrl) {
    return (
      <div 
        className={fallbackClassName}
        style={{ backgroundColor: getColorFromName(prospect.name || 'Unknown') }}
      >
        <span className="text-white font-semibold text-sm">
          {getInitials(prospect.name || 'UN')}
        </span>
      </div>
    );
  }

  // Success state
  return (
    <img
      ref={imgRef}
      src={imageState.currentUrl}
      alt={prospect.name}
      className={`${className} transition-opacity duration-300`}
      loading="lazy"
      onError={() => setImageState(prev => ({ ...prev, hasError: true }))}
    />
  );
};

export default LazyProspectImage;
