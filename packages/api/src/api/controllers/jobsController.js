const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const redisClient = require('../../services/redis');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const jobsController = {
  async getJobs(req, res) {
    try {
      const {
        page = 1,
        limit = 15,
        category,
        location,
        batch,
        tags,
        q: searchTerm
      } = req.query;

      const offset = (page - 1) * limit;
      
      // Create cache key
      const cacheKey = `jobs:${JSON.stringify(req.query)}`;
      
      // Try to get from cache first
      const cachedResult = await redisClient.get(cacheKey);
      if (cachedResult) {
        return res.json(JSON.parse(cachedResult));
      }

      let params = {
        TableName: process.env.JOBS_TABLE,
        FilterExpression: '#status = :active',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':active': 'active'
        }
      };

      // Add filters
      if (category) {
        params.FilterExpression += ' AND category = :category';
        params.ExpressionAttributeValues[':category'] = category;
      }

      if (location) {
        params.FilterExpression += ' AND contains(#location, :location)';
        params.ExpressionAttributeNames['#location'] = 'location';
        params.ExpressionAttributeValues[':location'] = location;
      }

      if (batch) {
        params.FilterExpression += ' AND contains(batch, :batch)';
        params.ExpressionAttributeValues[':batch'] = batch;
      }

      if (tags) {
        params.FilterExpression += ' AND contains(tags, :tags)';
        params.ExpressionAttributeValues[':tags'] = tags;
      }

      if (searchTerm) {
        params.FilterExpression += ' AND (contains(#role, :searchTerm) OR contains(companyName, :searchTerm))';
        params.ExpressionAttributeNames['#role'] = 'role';
        params.ExpressionAttributeValues[':searchTerm'] = searchTerm;
      }

      const command = new ScanCommand(params);
      const result = await docClient.send(command);

      // Sort by postedOn (newest first)
      const sortedJobs = result.Items.sort((a, b) => new Date(b.postedOn) - new Date(a.postedOn));

      // Paginate
      const paginatedJobs = sortedJobs.slice(offset, offset + parseInt(limit));
      
      const response = {
        jobs: paginatedJobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(sortedJobs.length / limit),
          totalJobs: sortedJobs.length,
          hasNext: offset + parseInt(limit) < sortedJobs.length,
          hasPrev: page > 1
        }
      };

      // Cache for 5 minutes
      await redisClient.setEx(cacheKey, 300, JSON.stringify(response));

      res.json(response);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  },

  async getJobById(req, res) {
    try {
      const { id } = req.params;

      // Try cache first
      const cacheKey = `job:${id}`;
      const cachedJob = await redisClient.get(cacheKey);
      if (cachedJob) {
        return res.json(JSON.parse(cachedJob));
      }

      // Since we need to search by jobId (sort key), we need to scan
      const params = {
        TableName: process.env.JOBS_TABLE,
        FilterExpression: 'jobId = :jobId',
        ExpressionAttributeValues: {
          ':jobId': id
        }
      };

      const command = new ScanCommand(params);
      const result = await docClient.send(command);

      if (!result.Items || result.Items.length === 0) {
        return res.status(404).json({ error: 'Job not found' });
      }

      const job = result.Items[0];

      // Cache for 10 minutes (600 seconds)
      await redisClient.setEx(cacheKey, 600, JSON.stringify(job));

      res.json(job);
    } catch (error) {
      console.error('Error fetching job:', error);
      res.status(500).json({ error: 'Failed to fetch job' });
    }
  }
};

module.exports = jobsController;