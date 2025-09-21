import React from 'react';

const SimpleLayout = ({ 
  leftPanel, 
  centerPanel, 
  rightPanel,
  topMenu
}) => {
  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Library */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {leftPanel}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800">P3DV</h1>
            <span className="text-sm text-gray-500">3D Model Viewer</span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Add Model
            </button>
            {topMenu}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* 3D Viewer */}
          <div className="flex-1 bg-gray-100">
            {centerPanel}
          </div>

          {/* Right Info Panel */}
          <div className="w-80 bg-white border-l border-gray-200">
            {rightPanel}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLayout;
