/**
 * Comprehensive Validation Utilities
 * Ensures data integrity and prevents runtime errors
 */

// Model validation schema
export const modelSchema = {
  id: (value) => typeof value === 'number' && value > 0,
  name: (value) => typeof value === 'string' && value.trim().length > 0,
  description: (value) => value === null || value === undefined || typeof value === 'string',
  category_id: (value) => value === null || value === undefined || (typeof value === 'number' && value > 0),
  file_path: (value) => typeof value === 'string' && value.trim().length > 0,
  file_size: (value) => value === null || value === undefined || (typeof value === 'number' && value >= 0),
  thumbnail_path: (value) => value === null || value === undefined || typeof value === 'string',
  metadata: (value) => value === null || value === undefined || typeof value === 'object',
  tags: (value) => Array.isArray(value),
  created_at: (value) => typeof value === 'string' && !isNaN(Date.parse(value)),
  updated_at: (value) => typeof value === 'string' && !isNaN(Date.parse(value))
};

// Category validation schema
export const categorySchema = {
  id: (value) => typeof value === 'number' && value > 0,
  name: (value) => typeof value === 'string' && value.trim().length > 0,
  description: (value) => value === null || value === undefined || typeof value === 'string',
  color: (value) => typeof value === 'string' && /^#[0-9A-F]{6}$/i.test(value),
  created_at: (value) => typeof value === 'string' && !isNaN(Date.parse(value))
};

// Tag validation schema
export const tagSchema = {
  id: (value) => typeof value === 'number' && value > 0,
  name: (value) => typeof value === 'string' && value.trim().length > 0,
  description: (value) => value === null || value === undefined || typeof value === 'string',
  color: (value) => typeof value === 'string' && /^#[0-9A-F]{6}$/i.test(value),
  created_at: (value) => typeof value === 'string' && !isNaN(Date.parse(value))
};

// Validation functions
export const validateModel = (model) => {
  if (!model || typeof model !== 'object') {
    return { valid: false, errors: ['Model must be an object'] };
  }

  const errors = [];
  
  for (const [key, validator] of Object.entries(modelSchema)) {
    if (!validator(model[key])) {
      errors.push(`Invalid ${key}: ${model[key]}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateCategory = (category) => {
  if (!category || typeof category !== 'object') {
    return { valid: false, errors: ['Category must be an object'] };
  }

  const errors = [];
  
  for (const [key, validator] of Object.entries(categorySchema)) {
    if (!validator(category[key])) {
      errors.push(`Invalid ${key}: ${category[key]}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateTag = (tag) => {
  if (!tag || typeof tag !== 'object') {
    return { valid: false, errors: ['Tag must be an object'] };
  }

  const errors = [];
  
  for (const [key, validator] of Object.entries(tagSchema)) {
    if (!validator(tag[key])) {
      errors.push(`Invalid ${key}: ${tag[key]}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Array validation
export const validateArray = (arr, itemValidator) => {
  if (!Array.isArray(arr)) {
    return { valid: false, errors: ['Expected an array'] };
  }

  const errors = [];
  
  arr.forEach((item, index) => {
    const validation = itemValidator(item);
    if (!validation.valid) {
      errors.push(`Item ${index}: ${validation.errors.join(', ')}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

// Safe data sanitization
export const sanitizeModel = (model) => {
  if (!model || typeof model !== 'object') {
    return null;
  }

  return {
    id: typeof model.id === 'number' ? model.id : 0,
    name: typeof model.name === 'string' ? model.name.trim() : '',
    description: typeof model.description === 'string' ? model.description.trim() : '',
    category_id: typeof model.category_id === 'number' ? model.category_id : null,
    file_path: typeof model.file_path === 'string' ? model.file_path.trim() : '',
    file_size: typeof model.file_size === 'number' ? model.file_size : 0,
    thumbnail_path: typeof model.thumbnail_path === 'string' ? model.thumbnail_path.trim() : null,
    metadata: typeof model.metadata === 'object' && model.metadata !== null ? model.metadata : {},
    tags: Array.isArray(model.tags) ? model.tags : [],
    created_at: typeof model.created_at === 'string' ? model.created_at : new Date().toISOString(),
    updated_at: typeof model.updated_at === 'string' ? model.updated_at : new Date().toISOString()
  };
};

export const sanitizeCategory = (category) => {
  if (!category || typeof category !== 'object') {
    return null;
  }

  return {
    id: typeof category.id === 'number' ? category.id : 0,
    name: typeof category.name === 'string' ? category.name.trim() : '',
    description: typeof category.description === 'string' ? category.description.trim() : '',
    color: typeof category.color === 'string' && /^#[0-9A-F]{6}$/i.test(category.color) ? category.color : '#6b7280',
    created_at: typeof category.created_at === 'string' ? category.created_at : new Date().toISOString()
  };
};

export const sanitizeTag = (tag) => {
  if (!tag || typeof tag !== 'object') {
    return null;
  }

  return {
    id: typeof tag.id === 'number' ? tag.id : 0,
    name: typeof tag.name === 'string' ? tag.name.trim() : '',
    description: typeof tag.description === 'string' ? tag.description.trim() : '',
    color: typeof tag.color === 'string' && /^#[0-9A-F]{6}$/i.test(tag.color) ? tag.color : '#6b7280',
    created_at: typeof tag.created_at === 'string' ? tag.created_at : new Date().toISOString()
  };
};

// Input validation
export const validateInput = (value, type, required = false) => {
  if (required && (value === null || value === undefined || value === '')) {
    return { valid: false, error: 'This field is required' };
  }

  if (!required && (value === null || value === undefined || value === '')) {
    return { valid: true };
  }

  switch (type) {
    case 'string':
      return { valid: typeof value === 'string' };
    case 'number':
      return { valid: typeof value === 'number' && !isNaN(value) };
    case 'email':
      return { valid: typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) };
    case 'url':
      try {
        new URL(value);
        return { valid: true };
      } catch {
        return { valid: false, error: 'Invalid URL format' };
      }
    case 'color':
      return { valid: typeof value === 'string' && /^#[0-9A-F]{6}$/i.test(value) };
    default:
      return { valid: true };
  }
};

// File validation
export const validateFile = (file, options = {}) => {
  if (!file || !(file instanceof File)) {
    return { valid: false, error: 'Invalid file' };
  }

  const { maxSize = 100 * 1024 * 1024, allowedTypes = ['.glb', '.gltf'] } = options;

  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit` };
  }

  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedTypes.includes(fileExtension)) {
    return { valid: false, error: `File type ${fileExtension} not allowed` };
  }

  return { valid: true };
};

export default {
  validateModel,
  validateCategory,
  validateTag,
  validateArray,
  sanitizeModel,
  sanitizeCategory,
  sanitizeTag,
  validateInput,
  validateFile
};
