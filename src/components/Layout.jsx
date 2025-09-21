import React, { useState } from 'react';

function Layout({ children, leftPanel, rightPanel, bottomPanel, topPanel }) {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [bottomCollapsed, setBottomCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Panel */}
      {topPanel && (
        <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
          {topPanel}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        {leftPanel && (
          <div className={`${leftCollapsed ? 'w-12' : 'w-80'} flex-shrink-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}>
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              {!leftCollapsed && <h3 className="text-sm font-semibold text-gray-700">Library</h3>}
              <button
                onClick={() => setLeftCollapsed(!leftCollapsed)}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                title={leftCollapsed ? 'Expand panel' : 'Collapse panel'}
              >
                <svg className={`w-4 h-4 transition-transform ${leftCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            {!leftCollapsed && (
              <div className="flex-1 overflow-hidden">
                {leftPanel}
              </div>
            )}
          </div>
        )}

        {/* Center Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Viewer Area */}
          <div className="flex-1 bg-gray-100">
            {children}
          </div>

          {/* Bottom Panel */}
          {bottomPanel && (
            <div className={`${bottomCollapsed ? 'h-8' : 'h-48'} bg-white border-t border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}>
              <div className="flex items-center justify-between p-2 border-b border-gray-200">
                {!bottomCollapsed && <h3 className="text-sm font-semibold text-gray-700">Properties</h3>}
                <button
                  onClick={() => setBottomCollapsed(!bottomCollapsed)}
                  className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                  title={bottomCollapsed ? 'Expand panel' : 'Collapse panel'}
                >
                  <svg className={`w-4 h-4 transition-transform ${bottomCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
              {!bottomCollapsed && (
                <div className="flex-1 overflow-auto p-4">
                  {bottomPanel}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel */}
        {rightPanel && (
          <div className={`${rightCollapsed ? 'w-12' : 'w-80'} flex-shrink-0 bg-white border-l border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}>
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              {!rightCollapsed && <h3 className="text-sm font-semibold text-gray-700">Tools</h3>}
              <button
                onClick={() => setRightCollapsed(!rightCollapsed)}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                title={rightCollapsed ? 'Expand panel' : 'Collapse panel'}
              >
                <svg className={`w-4 h-4 transition-transform ${rightCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            {!rightCollapsed && (
              <div className="flex-1 overflow-hidden">
                {rightPanel}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Layout;
