const redis = require('redis');

let client;

const initRedis = async () => {
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
    await client.connect();
  } catch (error) {
    console.error('Redis connection failed:', error);
    // Create a mock client for development
    client = {
      get: async () => null,
      set: async () => 'OK',
      setEx: async () => 'OK',
      del: async () => 1,
      exists: async () => 0
    };
  }
};

// Initialize Redis connection
initRedis().catch(console.error);

module.exports = client;