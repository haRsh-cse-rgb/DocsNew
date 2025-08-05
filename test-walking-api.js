const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api/v1';

async function testWalkingAPI() {
  try {
    console.log('Testing Walking API...\n');

    // Test 1: Get all walking opportunities
    console.log('1. Testing GET /walking');
    try {
      const response = await axios.get(`${API_BASE_URL}/walking`);
      console.log('✅ Success:', response.data.success);
      console.log('Count:', response.data.count);
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }

    // Test 2: Test authentication
    console.log('\n2. Testing authentication');
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        email: 'admin@jobquest.com',
        password: 'admin123'
      });
      console.log('✅ Login successful');
      const token = response.data.token;
      
      // Test 3: Create a walking opportunity (requires auth)
      console.log('\n3. Testing POST /walking (with auth)');
      try {
        const createResponse = await axios.post(`${API_BASE_URL}/walking`, {
          title: 'Test Walking Opportunity',
          company: 'Test Company',
          location: 'Test Location',
          experience: '0-1 years',
          category: 'Technology',
          date: '2024-01-15',
          time: '10:00',
          applyLink: 'https://example.com/apply'
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Create successful:', createResponse.data.success);
        
        // Test 4: Get the created walking opportunity
        const walkingId = createResponse.data.walking.id;
        console.log('\n4. Testing GET /walking/:id');
        try {
          const getResponse = await axios.get(`${API_BASE_URL}/walking/${walkingId}`);
          console.log('✅ Get by ID successful:', getResponse.data.success);
        } catch (error) {
          console.log('❌ Error getting by ID:', error.response?.data || error.message);
        }
        
        // Test 5: Delete the walking opportunity
        console.log('\n5. Testing DELETE /walking/:id');
        try {
          const deleteResponse = await axios.delete(`${API_BASE_URL}/walking/${walkingId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('✅ Delete successful:', deleteResponse.data.success);
        } catch (error) {
          console.log('❌ Error deleting:', error.response?.data || error.message);
        }
        
      } catch (error) {
        console.log('❌ Error creating walking:', error.response?.data || error.message);
      }
      
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testWalkingAPI(); 