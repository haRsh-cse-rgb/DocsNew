# SEO Setup Documentation

This document explains the SEO setup for the India Jobs website, including robots.txt and sitemap configuration.

## Files Created

### 1. `public/robots.txt`
- **Location**: `packages/web/public/robots.txt`
- **Purpose**: Tells search engine crawlers which pages to index and which to ignore
- **Key Features**:
  - Allows crawling of all main pages (jobs, internships, government jobs, etc.)
  - Blocks admin and API routes for security
  - Includes sitemap reference
  - Sets crawl delay to be respectful to server

### 2. `app/sitemap.ts`
- **Location**: `packages/web/app/sitemap.ts`
- **Purpose**: Dynamic sitemap generation using Next.js 13+ App Router
- **Key Features**:
  - Automatically generates sitemap.xml at `/sitemap.xml`
  - Includes all static pages with appropriate priorities
  - Includes category pages for jobs, internships, and walking interviews
  - Optional dynamic data fetching from API (commented out)
  - Configurable base URL via environment variable

### 3. `app/config/sitemap-config.ts`
- **Location**: `packages/web/app/config/sitemap-config.ts`
- **Purpose**: Centralized configuration for all sitemap settings
- **Key Features**:
  - Easy to customize categories for jobs, internships, and walking interviews
  - Helper functions to add/remove categories programmatically
  - All settings in one place for easy maintenance

### 4. `public/sitemap.xml`
- **Location**: `packages/web/public/sitemap.xml`
- **Purpose**: Static fallback sitemap
- **Key Features**:
  - Static XML sitemap as backup
  - Includes all main pages and categories
  - Proper XML formatting with priorities and change frequencies

### 5. `scripts/generate-sitemap.js`
- **Location**: `packages/web/scripts/generate-sitemap.js`
- **Purpose**: Script to generate static sitemap.xml from configuration
- **Key Features**:
  - Automatically generates sitemap.xml based on configuration
  - Updates lastModified dates automatically
  - Provides statistics about generated URLs

## Configuration

### Environment Variables
Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

### Customizing the Sitemap

#### 1. Update Base URL
Replace `https://yourdomain.com` with your actual domain in:
- `public/robots.txt`
- `public/sitemap.xml`
- `app/sitemap.ts`

#### 2. Customize Categories (EASY!)
To add, remove, or modify categories, simply edit `app/config/sitemap-config.ts`:

```typescript
// Example: Add new job categories
categories: {
  jobs: {
    path: '/jobs/category',
    priority: 0.7,
    changeFreq: 'daily' as const,
    items: [
      'technology',
      'marketing', 
      'sales',
      'finance',
      // Add your custom categories here:
      'data-science',        // ✅ New category
      'product-management',  // ✅ New category
      'human-resources',     // ✅ New category
      // Remove any categories you don't want:
      // 'operations',       // ❌ Comment out to remove
    ]
  },
  // ... other categories
}
```

**Available category types:**
- `jobs` - Job categories
- `internships` - Internship categories  
- `walking` - Walking interview categories

#### 3. Add Dynamic Pages (Optional)
To include individual job/internship pages in the sitemap:

1. Uncomment the dynamic fetching code in `app/sitemap.ts`
2. Ensure your API endpoints return the required data
3. The sitemap will automatically include individual pages with proper priorities

#### 4. Generate Static Sitemap
After updating categories, regenerate the static sitemap:

```bash
cd packages/web
node scripts/generate-sitemap.js
```

#### 5. Using Helper Functions (Optional)
The configuration file includes helper functions for programmatic category management:

```typescript
import { addCategory, removeCategory, getAllCategories } from './config/sitemap-config'

// Add a new category
addCategory('jobs', 'blockchain')

// Remove a category
removeCategory('internships', 'operations')

// Get all current categories
const allCategories = getAllCategories()
console.log(allCategories.jobs) // ['technology', 'marketing', ...]
```

#### 4. Customize Priorities
Adjust the priority values based on your SEO strategy:
- Homepage: 1.0
- Main section pages: 0.9
- Category pages: 0.7
- Individual pages: 0.6

## Testing

### Test robots.txt
Visit: `https://yourdomain.com/robots.txt`

### Test sitemap
Visit: `https://yourdomain.com/sitemap.xml`

### Validate sitemap
Use Google Search Console or online sitemap validators to ensure proper formatting.

## Search Engine Submission

1. **Google Search Console**:
   - Add your sitemap URL: `https://yourdomain.com/sitemap.xml`
   - Submit for indexing

2. **Bing Webmaster Tools**:
   - Add your sitemap URL
   - Submit for indexing

3. **Other Search Engines**:
   - Submit sitemap to other search engines as needed

## Maintenance

### Regular Updates
- Update `lastModified` dates in static sitemap when content changes
- Monitor sitemap performance in search console
- Add new categories as your content grows

### Performance Considerations
- The dynamic sitemap includes caching (1 hour revalidation)
- Consider implementing sitemap indexing for large sites
- Monitor API response times for dynamic sitemap generation

## Troubleshooting

### Common Issues
1. **Sitemap not accessible**: Check file permissions and Next.js configuration
2. **Robots.txt not found**: Ensure file is in `public` directory
3. **Dynamic sitemap errors**: Check API endpoints and error handling

### Debugging
- Check browser developer tools for network errors
- Verify environment variables are set correctly
- Test API endpoints independently

## Additional SEO Considerations

1. **Meta Tags**: Already configured in `app/layout.tsx`
2. **Structured Data**: Consider adding JSON-LD for job listings
3. **Page Speed**: Optimize images and code for better rankings
4. **Mobile Optimization**: Ensure responsive design
5. **Internal Linking**: Implement proper internal link structure

## Support

For issues or questions about the SEO setup, refer to:
- Next.js documentation on sitemaps
- Google Search Console documentation
- Webmaster guidelines for robots.txt
