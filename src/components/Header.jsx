import React from 'react';

function Header({ onToggleSidebar, sidebarOpen }) {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button 
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Hide Library" : "Show Library"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            )}
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Presentation 3D Viewer</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md font-medium">
          v1.0.0
        </div>
      </div>
    </header>
  );
}

export default Header;
