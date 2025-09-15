const fs = require('fs');
const path = require('path');

// Import the sitemap configuration
const { SITEMAP_CONFIG } = require('../app/config/sitemap-config.ts');

function generateSitemapXML() {
  const baseUrl = SITEMAP_CONFIG.baseUrl;
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add main pages
  SITEMAP_CONFIG.mainPages.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>${page.changeFreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  });
  
  // Add category pages
  Object.entries(SITEMAP_CONFIG.categories).forEach(([categoryType, config]) => {
    config.items.forEach(category => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${config.path}/${category}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${config.changeFreq}</changefreq>\n`;
      xml += `    <priority>${config.priority}</priority>\n`;
      xml += `  </url>\n`;
    });
  });
  
  xml += '</urlset>\n';
  
  // Write to public/sitemap.xml
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(sitemapPath, xml);
  
  console.log('✅ Static sitemap.xml generated successfully!');
  console.log(`📁 Location: ${sitemapPath}`);
  console.log(`🌐 Base URL: ${baseUrl}`);
  
  // Log statistics
  const mainPagesCount = SITEMAP_CONFIG.mainPages.length;
  const categoriesCount = Object.values(SITEMAP_CONFIG.categories)
    .reduce((total, config) => total + config.items.length, 0);
  
  console.log(`📊 Statistics:`);
  console.log(`   - Main pages: ${mainPagesCount}`);
  console.log(`   - Category pages: ${categoriesCount}`);
  console.log(`   - Total URLs: ${mainPagesCount + categoriesCount}`);
}

// Run the generator
generateSitemapXML();
