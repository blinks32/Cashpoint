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
    // Don't load if no propertyId is provided
    if (!propertyId || propertyId === 'your_actual_property_id_here') {
      console.warn('TawkTo: No valid property ID provided');
      return;
    }

    // Check if Tawk_API already exists to avoid duplicate loading
    if (window.Tawk_API) {
      console.log('TawkTo: Already loaded');
      return;
    }

    console.log('TawkTo: Loading chat widget with property ID:', propertyId);

    // Initialize Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Set up Tawk_API callbacks
    window.Tawk_API.onLoad = function() {
      console.log('TawkTo: Chat widget loaded successfully');
      
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
        
        console.log('TawkTo: User information set for authenticated user');
      }
    };

    window.Tawk_API.onStatusChange = function(status) {
      console.log('TawkTo: Status changed to:', status);
    };

    // Create and append the Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    script.onload = () => {
      console.log('TawkTo: Script loaded successfully');
    };
    
    script.onerror = (error) => {
      console.error('TawkTo: Failed to load script', error);
    };
    
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Remove the script when component unmounts
      const existingScript = document.querySelector(`script[src*="${propertyId}"]`);
      if (existingScript) {
        existingScript.remove();
      }
      
      // Clean up global variables
      if (window.Tawk_API) {
        delete window.Tawk_API;
      }
      if (window.Tawk_LoadStart) {
        delete window.Tawk_LoadStart;
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