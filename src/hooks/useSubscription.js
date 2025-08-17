import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSubscriptionStatus } from '@/services/stripe';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isScout, setIsScout] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get subscription data from profiles table
        const subscriptionData = await getSubscriptionStatus(user.id);
        setSubscription(subscriptionData);
        
        // Check if user has active Scout subscription
        const hasActiveSubscription = subscriptionData && 
          subscriptionData.subscription_tier === 'scout' &&
          (subscriptionData.subscription_status === 'active' || !subscriptionData.subscription_status);
        
        setIsScout(hasActiveSubscription);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        // Gracefully fail - assume free tier
        setIsScout(false);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  return {
    subscription,
    loading,
    isScout,
    refreshSubscription: () => {
      if (user) {
        setLoading(true);
        fetchSubscription();
      }
    }
  };
};
