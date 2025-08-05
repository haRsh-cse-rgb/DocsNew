const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API_BASE_URL = 'http://localhost:5001/api/v1';

async function testBulkUpload() {
  try {
    console.log('Testing Bulk Upload API...\n');

    // First, login to get token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/admin/login`, {
      email: 'admin@jobquest.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful\n');

    // Create a test CSV file
    console.log('2. Creating test CSV file...');
    const csvContent = `title,company,location,experience,category,date,time,applyLink
"Test Walking 1","Test Company 1","Test Location 1","0-1 years","Technology","2024-01-15","10:00","https://example1.com/apply"
"Test Walking 2","Test Company 2","Test Location 2","1-2 years","Marketing","2024-01-20","14:00","https://example2.com/apply"`;

    fs.writeFileSync('test-walking.csv', csvContent);
    console.log('✅ Test CSV file created\n');

    // Test bulk upload
    console.log('3. Testing bulk upload...');
    const formData = new FormData();
    formData.append('file', fs.createReadStream('test-walking.csv'));

    try {
      const uploadResponse = await axios.post(`${API_BASE_URL}/walking/bulk-upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        }
      });
      
      console.log('✅ Bulk upload successful');
      console.log('Response:', uploadResponse.data);
    } catch (error) {
      console.log('❌ Bulk upload failed');
      console.log('Status:', error.response?.status);
      console.log('Data:', error.response?.data);
      console.log('Message:', error.message);
    }

    // Clean up
    fs.unlinkSync('test-walking.csv');
    console.log('\n✅ Test CSV file cleaned up');

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testBulkUpload(); 