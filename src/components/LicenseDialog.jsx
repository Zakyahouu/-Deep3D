import React, { useState, useEffect } from 'react';
import LicenseManager from '../utils/licenseManager.js';

const LicenseDialog = ({ isOpen, onClose, onActivated }) => {
  const [step, setStep] = useState('enter-key'); // enter-key, generate-code, enter-code, success
  const [licenseKey, setLicenseKey] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [licenseManager] = useState(() => new LicenseManager());

  useEffect(() => {
    if (isOpen) {
      setStep('enter-key');
      setLicenseKey('');
      setActivationCode('');
      setGeneratedCode('');
      setError('');
    }
  }, [isOpen]);

  const handleGenerateCode = async () => {
    if (!licenseKey.trim()) {
      setError('Please enter a license key');
      return;
    }

    if (!licenseManager.isValidLicenseKey(licenseKey)) {
      setError('Invalid license key format. Expected: P3DV-XXXX-XXXX-XXXX-XXXX');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const code = await licenseManager.generateActivationCode(licenseKey);
      setGeneratedCode(code);
      setStep('generate-code');
    } catch (err) {
      setError(err.message || 'Failed to generate activation code');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!activationCode.trim()) {
      setError('Please enter the activation code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await licenseManager.activateLicense(licenseKey, activationCode);
      
      if (result.success) {
        setStep('success');
        if (onActivated) {
          onActivated(result);
        }
      } else {
        setError(result.error || 'Activation failed');
      }
    } catch (err) {
      setError(err.message || 'Activation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSampleKey = () => {
    const sampleKey = licenseManager.generateSampleLicenseKey();
    setLicenseKey(sampleKey);
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              License Activation
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex items-center ${step === 'enter-key' ? 'text-blue-600' : step === 'generate-code' || step === 'enter-code' || step === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'enter-key' ? 'bg-blue-100 text-blue-600' : step === 'generate-code' || step === 'enter-code' || step === 'success' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Enter License</span>
              </div>
              
              <div className={`flex items-center ${step === 'generate-code' ? 'text-blue-600' : step === 'enter-code' || step === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'generate-code' ? 'bg-blue-100 text-blue-600' : step === 'enter-code' || step === 'success' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Get Code</span>
              </div>
              
              <div className={`flex items-center ${step === 'enter-code' ? 'text-blue-600' : step === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'enter-code' ? 'bg-blue-100 text-blue-600' : step === 'success' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Activate</span>
              </div>
              
              <div className={`flex items-center ${step === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'success' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium">Complete</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Enter License Key */}
          {step === 'enter-key' && (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Key
                </label>
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                  placeholder="P3DV-XXXX-XXXX-XXXX-XXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center"
                  maxLength={24}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter your P3DV license key. Format: P3DV-XXXX-XXXX-XXXX-XXXX
                </p>
              </div>

              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">Demo Mode</h4>
                <p className="text-sm text-blue-700 mb-3">
                  For testing purposes, you can generate a sample license key:
                </p>
                <button
                  onClick={handleGenerateSampleKey}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Generate Sample Key
                </button>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateCode}
                  disabled={loading || !licenseKey.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Generating...' : 'Next Step'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Generate Activation Code */}
          {step === 'generate-code' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Activation Code Generated
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your activation code has been generated. In a real-world scenario, you would send this code to the license server to get an activation response.
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Key
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md font-mono text-sm">
                    {licenseKey}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activation Code (Send to License Server)
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md font-mono text-xs break-all">
                    {generatedCode}
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedCode)}
                    className="mt-2 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Copy Code
                  </button>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h4 className="font-medium text-yellow-900 mb-2">Demo Mode</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    For demonstration, we'll use the same code as the activation response. 
                    In production, the server would return a different signed activation response.
                  </p>
                  <button
                    onClick={() => {
                      setActivationCode(generatedCode);
                      setStep('enter-code');
                    }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm"
                  >
                    Use as Activation Response (Demo)
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('enter-key')}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('enter-code')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Enter Activation Code */}
          {step === 'enter-code' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Enter Activation Response
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the activation response you received from the license server.
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activation Response
                  </label>
                  <textarea
                    value={activationCode}
                    onChange={(e) => setActivationCode(e.target.value)}
                    placeholder="Paste the activation response here..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('generate-code')}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleActivate}
                  disabled={loading || !activationCode.trim()}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Activating...' : 'Activate License'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  License Activated Successfully!
                </h3>
                <p className="text-gray-600">
                  Your P3DV license has been activated on this device.
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Continue to Application
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LicenseDialog;
