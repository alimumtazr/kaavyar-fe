/**
 * Format price in Pakistani Rupees
 */
export function formatPrice(price) {
  return `Rs. ${price.toLocaleString('en-PK')}`
}

/**
 * Get URL search params as object
 */
export function getSearchParams(searchString) {
  const params = new URLSearchParams(searchString)
  const result = {}
  for (const [key, value] of params) {
    result[key] = value
  }
  return result
}

/**
 * Build URL with search params
 */
export function buildUrl(base, params) {
  const url = new URL(base, window.location.origin)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })
  return url.pathname + url.search
}

/**
 * Truncate text
 */
export function truncate(text, length = 100) {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

/**
 * Category display names
 */
export const categoryLabels = {
  'ready-to-wear': 'Ready to Wear',
  'couture': 'Couture',
  'menswear': 'Menswear',
  'accessories': 'Accessories',
  'bridal': 'Bridal',
  'kurtas': 'Kurtas & Tunics',
  'kaftans': 'Kaftans',
  'tops': 'Tops',
  'pants': 'Pants',
  'sets': 'Matching Sets',
  'anarkalis': 'Anarkalis',
  'sarees': 'Sarees',
  'jackets': 'Jackets',
  'lehengas': 'Lehengas',
  'gowns': 'Gowns',
  'sherwanis': 'Sherwanis',
  'kurta-shalwar': 'Kurta Shalwar',
  'waistcoats': 'Waistcoats',
  'bridal-lehengas': 'Bridal Lehengas',
  'bridal-sarees': 'Bridal Sarees',
  'kurta-sets': 'Kurta Sets',
  'formal-kurtas': 'Formal Kurtas'
}

/**
 * Get category label
 */
export function getCategoryLabel(category) {
  return categoryLabels[category] || category
}







