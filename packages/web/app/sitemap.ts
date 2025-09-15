import { MetadataRoute } from 'next'
import { SITEMAP_CONFIG } from './config/sitemap-config'

// Function to fetch jobs from API (optional - for dynamic sitemap)
async function fetchJobs() {
  try {
    const response = await fetch(`https://api.india-jobs/api/v1/jobs?limit=100`, { 
      next: { revalidate: 3600 } 
    })
    if (response.ok) {
      const data = await response.json()
      return data.jobs || []
    }
  } catch (error) {
    console.error('Error fetching jobs for sitemap:', error)
  }
  return []
}

// Function to fetch internships from API (optional - for dynamic sitemap)
async function fetchInternships() {
  try {
    const response = await fetch(`https://api.india-jobs/api/v1/internships?limit=100`, { 
      next: { revalidate: 3600 } 
    })
    if (response.ok) {
      const data = await response.json()
      return data.internships || []
    }
  } catch (error) {
    console.error('Error fetching internships for sitemap:', error)
  }
  return []
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  // Add main pages
  SITEMAP_CONFIG.mainPages.forEach(page => {
    sitemapEntries.push({
      url: `${SITEMAP_CONFIG.baseUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFreq,
      priority: page.priority,
    })
  })
  
  // Add category pages dynamically
  Object.entries(SITEMAP_CONFIG.categories).forEach(([categoryType, config]) => {
    config.items.forEach(category => {
      sitemapEntries.push({
        url: `${SITEMAP_CONFIG.baseUrl}${config.path}/${category}`,
        lastModified: new Date(),
        changeFrequency: config.changeFreq,
        priority: config.priority,
      })
    })
  })
  
  // Dynamic job pages (optional - uncomment if you want to include individual job pages)
  // const jobs = await fetchJobs()
  // jobs.forEach((job: any) => {
  //   sitemapEntries.push({
  //     url: `${SITEMAP_CONFIG.baseUrl}/jobs/${job._id}`,
  //     lastModified: new Date(job.updatedAt || job.createdAt),
  //     changeFrequency: 'weekly' as const,
  //     priority: 0.6,
  //   })
  // })

  // Dynamic internship pages (optional - uncomment if you want to include individual internship pages)
  // const internships = await fetchInternships()
  // internships.forEach((internship: any) => {
  //   sitemapEntries.push({
  //     url: `${SITEMAP_CONFIG.baseUrl}/internships/${internship._id}`,
  //     lastModified: new Date(internship.updatedAt || internship.createdAt),
  //     changeFrequency: 'weekly' as const,
  //     priority: 0.6,
  //   })
  // })

  return sitemapEntries
}
