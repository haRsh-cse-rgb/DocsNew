// Sitemap Configuration - Easy to customize
export const SITEMAP_CONFIG = {
  // Base URL - Update this with your actual domain
  baseUrl: 'https://india-jobs.in',
  
  // API URL for dynamic data fetching
  apiUrl: 'https://api.india-jobs.in/api/v1',
  
  // Main pages configuration
  mainPages: [
    { path: '/', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/jobs', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/internships', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/government-jobs', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/certifications', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/walking', priority: 0.8, changeFreq: 'daily' as const },
    // Add more main pages here if needed
    // { path: '/about', priority: 0.7, changeFreq: 'monthly' as const },
    // { path: '/contact', priority: 0.6, changeFreq: 'monthly' as const },
  ],
  
  // Category configurations - CUSTOMIZE THESE AS NEEDED
  categories: {
    jobs: {
      path: '/jobs/category',
      priority: 0.7,
      changeFreq: 'daily' as const,
      items: [
        // CUSTOMIZE YOUR JOB CATEGORIES HERE
        'technology',
        'software-engineer',
        'marketing', 
        'sales',
        'finance',
        'healthcare',
        'education',
        'engineering',
        'design',
        'customer-service',
        'operations',
        // Add your custom job categories here:
        // 'data-science',
        // 'product-management',
        // 'human-resources',
        // 'legal',
        // 'consulting',
        // 'real-estate',
        // 'media',
        // 'non-profit',
      ]
    },
    internships: {
      path: '/internships/category',
      priority: 0.7,
      changeFreq: 'daily' as const,
      items: [
        // CUSTOMIZE YOUR INTERNSHIP CATEGORIES HERE
        'technology',
        'marketing',
        'finance',
        'design',
        'research',
        'operations',
        // Add your custom internship categories here:
        // 'data-analytics',
        // 'content-writing',
        // 'social-media',
        // 'graphic-design',
        // 'business-development',
        // 'public-relations',
        // 'event-management',
        // 'environmental-science',
      ]
    },
    walking: {
      path: '/walking/category',
      priority: 0.6,
      changeFreq: 'daily' as const,
      items: [
        // CUSTOMIZE YOUR WALKING INTERVIEW CATEGORIES HERE
        'technology',
        'retail',
        'hospitality',
        'manufacturing',
        'logistics',
        // Add your custom walking interview categories here:
        // 'food-service',
        // 'warehouse',
        // 'delivery',
        // 'security',
        // 'cleaning',
        // 'construction',
        // 'agriculture',
        // 'transportation',
      ]
    }
  }
}

// Helper function to add new categories
export function addCategory(type: 'jobs' | 'internships' | 'walking', category: string) {
  if (SITEMAP_CONFIG.categories[type]) {
    SITEMAP_CONFIG.categories[type].items.push(category)
  }
}

// Helper function to remove categories
export function removeCategory(type: 'jobs' | 'internships' | 'walking', category: string) {
  if (SITEMAP_CONFIG.categories[type]) {
    const index = SITEMAP_CONFIG.categories[type].items.indexOf(category)
    if (index > -1) {
      SITEMAP_CONFIG.categories[type].items.splice(index, 1)
    }
  }
}

// Helper function to get all categories
export function getAllCategories() {
  return {
    jobs: SITEMAP_CONFIG.categories.jobs.items,
    internships: SITEMAP_CONFIG.categories.internships.items,
    walking: SITEMAP_CONFIG.categories.walking.items,
  }
}
