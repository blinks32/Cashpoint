import React from 'react';

const TawkToTest: React.FC = () => {
  const testTawkTo = () => {
    console.log('Testing TawkTo integration...');
    console.log('Tawk_API exists:', !!window.Tawk_API);
    console.log('Tawk_LoadStart:', window.Tawk_LoadStart);
    
    if (window.Tawk_API) {
      console.log('TawkTo API methods available:', Object.keys(window.Tawk_API));
      
      // Try to show the widget
      if (window.Tawk_API.showWidget) {
        window.Tawk_API.showWidget();
        console.log('Attempted to show TawkTo widget');
      }
      
      // Try to maximize the chat
      if (window.Tawk_API.maximize) {
        window.Tawk_API.maximize();
        console.log('Attempted to maximize TawkTo chat');
      }
    } else {
      console.error('TawkTo API not available');
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={testTawkTo}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors text-sm"
      >
        Test TawkTo
      </button>
    </div>
  );
};

export default TawkToTest;