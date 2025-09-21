/**
 * License Manager for P3DV
 * Handles offline license activation and validation
 */

// License Manager for the renderer process
// Hardware fingerprinting is handled by the main process

class LicenseManager {
  constructor() {
    this.licenseKey = null;
    this.isActivated = false;
    this.activationData = null;
    this.secretKey = 'P3DV_SECRET_KEY_2024'; // In production, use environment variable
  }

  /**
   * Generate hardware fingerprint (delegated to main process)
   */
  async generateHardwareFingerprint() {
    try {
      if (!window.electronAPI) {
        throw new Error('Electron API not available');
      }
      
      return await window.electronAPI.generateHardwareFingerprint();
    } catch (error) {
      console.error('Error generating hardware fingerprint:', error);
      throw new Error('Failed to generate hardware fingerprint');
    }
  }

  /**
   * Generate activation code from license key and hardware fingerprint
   */
  async generateActivationCode(licenseKey) {
    try {
      const fingerprint = await this.generateHardwareFingerprint();
      const timestamp = Date.now();
      
      // Create activation payload
      const payload = {
        licenseKey,
        fingerprint,
        timestamp,
        product: 'P3DV',
        version: '1.0.0'
      };

      // Sign the payload (delegated to main process for security)
      const signature = await window.electronAPI.signPayload(JSON.stringify(payload));

      const activationCode = btoa(JSON.stringify({
        ...payload,
        signature
      }));

      return activationCode;
    } catch (error) {
      console.error('Error generating activation code:', error);
      throw new Error('Failed to generate activation code');
    }
  }

  /**
   * Validate activation code
   */
  async validateActivationCode(activationCode) {
    try {
      // Decode activation code
      const decoded = JSON.parse(atob(activationCode));
      const { licenseKey, fingerprint, timestamp, product, version, signature } = decoded;

      // Verify signature (delegated to main process for security)
      const payload = { licenseKey, fingerprint, timestamp, product, version };
      const expectedSignature = await window.electronAPI.signPayload(JSON.stringify(payload));

      if (signature !== expectedSignature) {
        throw new Error('Invalid activation code signature');
      }

      // Verify hardware fingerprint
      const currentFingerprint = await this.generateHardwareFingerprint();
      if (fingerprint !== currentFingerprint) {
        throw new Error('Activation code not valid for this machine');
      }

      // Verify product and license format
      if (product !== 'P3DV') {
        throw new Error('Activation code not valid for this product');
      }

      if (!this.isValidLicenseKey(licenseKey)) {
        throw new Error('Invalid license key format');
      }

      // Check if activation is not too old (30 days grace period)
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      if (Date.now() - timestamp > maxAge) {
        throw new Error('Activation code has expired');
      }

      return {
        valid: true,
        licenseKey,
        fingerprint,
        timestamp,
        product,
        version
      };
    } catch (error) {
      console.error('Error validating activation code:', error);
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Validate license key format
   */
  isValidLicenseKey(licenseKey) {
    // Expected format: P3DV-XXXX-XXXX-XXXX-XXXX
    const licensePattern = /^P3DV-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return licensePattern.test(licenseKey);
  }

  /**
   * Activate license
   */
  async activateLicense(licenseKey, activationCode) {
    try {
      // Validate activation code
      const validation = await this.validateActivationCode(activationCode);
      
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Verify license key matches
      if (validation.licenseKey !== licenseKey) {
        throw new Error('License key does not match activation code');
      }

      // Store activation data
      this.licenseKey = licenseKey;
      this.isActivated = true;
      this.activationData = validation;

      // Save to storage
      await this.saveActivationData();

      return {
        success: true,
        message: 'License activated successfully',
        licenseKey,
        activatedAt: new Date(validation.timestamp).toISOString()
      };
    } catch (error) {
      console.error('Error activating license:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Save activation data to local storage
   */
  async saveActivationData() {
    try {
      if (!window.electronAPI) {
        throw new Error('Electron API not available');
      }

      const data = {
        licenseKey: this.licenseKey,
        isActivated: this.isActivated,
        activationData: this.activationData,
        savedAt: Date.now()
      };

      await window.electronAPI.saveLicenseData(data);
    } catch (error) {
      console.error('Error saving activation data:', error);
      throw error;
    }
  }

  /**
   * Load activation data from local storage
   */
  async loadActivationData() {
    try {
      if (!window.electronAPI) {
        throw new Error('Electron API not available');
      }

      const data = await window.electronAPI.loadLicenseData();
      
      if (data) {
        this.licenseKey = data.licenseKey;
        this.isActivated = data.isActivated;
        this.activationData = data.activationData;

        // Verify activation is still valid
        if (this.isActivated && this.activationData) {
          const currentFingerprint = await this.generateHardwareFingerprint();
          if (this.activationData.fingerprint !== currentFingerprint) {
            // Hardware changed, deactivate
            await this.deactivateLicense();
            return false;
          }
        }

        return this.isActivated;
      }

      return false;
    } catch (error) {
      console.error('Error loading activation data:', error);
      return false;
    }
  }

  /**
   * Deactivate license
   */
  async deactivateLicense() {
    try {
      this.licenseKey = null;
      this.isActivated = false;
      this.activationData = null;

      if (window.electronAPI) {
        await window.electronAPI.clearLicenseData();
      }

      return {
        success: true,
        message: 'License deactivated successfully'
      };
    } catch (error) {
      console.error('Error deactivating license:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get license status
   */
  getLicenseStatus() {
    return {
      isActivated: this.isActivated,
      licenseKey: this.licenseKey,
      activationData: this.activationData
    };
  }

  /**
   * Generate a sample license key (for demo purposes)
   */
  generateSampleLicenseKey() {
    const segments = [];
    for (let i = 0; i < 4; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += Math.random().toString(36).charAt(2).toUpperCase();
      }
      segments.push(segment);
    }
    return `P3DV-${segments.join('-')}`;
  }
}

export default LicenseManager;
