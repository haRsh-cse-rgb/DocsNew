const axios = require('axios');

async function testStats() {
  try {
    console.log('Testing stats endpoint...');
    const response = await axios.get('http://localhost:5001/api/v1/admin/stats', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log('Stats response:', response.data);
  } catch (error) {
    console.error('Error testing stats:', error.response?.data || error.message);
  }
}

testStats(); 