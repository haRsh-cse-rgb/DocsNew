const redis = require('redis');

let client;

try {
  client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  client.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  client.on('connect', () => {
    console.log('✅ Connected to Redis');
  });

  // Connect to Redis
  client.connect().catch(console.error);
} catch (error) {
  console.error('Redis connection failed:', error);
  // Create a mock client for development
  client = {
    get: async () => null,
    set: async () => 'OK',
    setex: async () => 'OK',
    del: async () => 1,
    exists: async () => 0
  };
}

module.exports = client;