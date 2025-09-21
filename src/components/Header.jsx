import React from 'react';

function Header({ 
  onToggleSidebar, 
  sidebarOpen, 
  isLicensed, 
  onOpenLicense,
  onAdvancedSearch,
  onToggleSelection,
  selectionMode,
  selectedCount,
  searchActive,
  onClearSearch,
  onOpenSettings
}) {
  // Licensing temporarily disabled - default to licensed state
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

      {/* Center - Feature buttons */}
      <div className="flex items-center gap-2">
        {/* Search status */}
        {searchActive && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search Active</span>
            <button
              onClick={onClearSearch}
              className="ml-1 text-blue-600 hover:text-blue-800"
              title="Clear Search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Selection mode indicator */}
        {selectionMode && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{selectedCount} selected</span>
          </div>
        )}

        {/* Advanced Search Button */}
        <button
          onClick={onAdvancedSearch}
          className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
          title="Advanced Search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </button>

        {/* Selection Mode Toggle */}
        <button
          onClick={onToggleSelection}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${
            selectionMode 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
          title={selectionMode ? 'Exit Selection Mode' : 'Enter Selection Mode'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {selectionMode ? 'Exit Select' : 'Select'}
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        {/* License Status - TEMPORARILY DISABLED */}
        {/* <button
          onClick={onOpenLicense}
          className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            isLicensed 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
          title={isLicensed ? 'License Active' : 'License Required'}
        >
          <div className={`w-2 h-2 rounded-full ${
            isLicensed ? 'bg-green-600' : 'bg-red-600'
          }`}></div>
          {isLicensed ? 'Licensed' : 'Unlicensed'}
        </button> */}
        
        <button
          onClick={onOpenSettings}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          title="Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md font-medium">
          v1.0.0
        </div>
      </div>
    </header>
  );
}

export default Header;
