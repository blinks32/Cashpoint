import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface TawkToChatProps {
  propertyId: string;
  widgetId?: string;
}

const TawkToChat: React.FC<TawkToChatProps> = ({ 
  propertyId, 
  widgetId = 'default' 
}) => {
  const { user } = useAuth();

  useEffect(() => {
    // Check if Tawk_API already exists to avoid duplicate loading
    if (window.Tawk_API) {
      return;
    }

    // Initialize Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Set up Tawk_API callbacks
    window.Tawk_API.onLoad = function() {
      // Set visitor information if user is logged in
      if (user && window.Tawk_API) {
        window.Tawk_API.visitor = {
          name: user.email || 'User',
          email: user.email || ''
        };

        // Add user attributes
        window.Tawk_API.setAttributes?.({
          userId: user.id,
          userType: 'authenticated'
        });
      }
    };

    // Create and append the Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    // Cleanup function
    return () => {
      // Remove the script when component unmounts
      const existingScript = document.querySelector(`script[src*="${propertyId}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [propertyId, widgetId]);

  // Update visitor info when user changes
  useEffect(() => {
    if (window.Tawk_API && user) {
      window.Tawk_API.visitor = {
        name: user.email || 'User',
        email: user.email || ''
      };

      window.Tawk_API.setAttributes?.({
        userId: user.id,
        userType: 'authenticated'
      });
    }
  }, [user]);

  return null; // This component doesn't render anything visible
};

export default TawkToChat;