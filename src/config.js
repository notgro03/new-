// Admin configuration constants
export const UPLOADCARE_CONFIG = {
  publicKey: '1985ca48f4d597426e30',
  tabs: 'file url',
  previewStep: true,
  clearable: true,
  multiple: false,
  imagesOnly: true,
  crop: '1:1'
};

export const DB_CONFIG = {
  name: 'kioskeysDB',
  version: 1,
  stores: {
    brands: '++id, name, type, logo',
    products: '++id, name, brandId, category, price, description, image',
    categories: '++id, name, description',
    settings: 'key, value'
  }
};