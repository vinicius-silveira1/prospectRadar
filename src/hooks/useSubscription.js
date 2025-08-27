import { useAuth } from '@/context/AuthContext';

// This hook is now a simple wrapper around useAuth to provide
// a consistent API for checking subscription status.
export const useSubscription = () => {
  const { user, loading, refreshUserProfile } = useAuth();

  // A user is considered a "Scout" if their tier is 'scout' AND
  // the subscription status from Stripe is 'active'.
  const isScout = user?.subscription_tier === 'scout' && user?.subscription_status === 'active';

  return {
    // The entire user object can represent the subscription context
    subscription: user, 
    
    // Pass through the loading state from useAuth
    loading, 
    
    // The calculated boolean for convenience
    isScout,
    
    // Pass through the refresh function from AuthContext, aliased for compatibility
    refreshSubscription: refreshUserProfile
  };
};