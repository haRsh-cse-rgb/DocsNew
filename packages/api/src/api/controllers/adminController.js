const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, BatchWriteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const xlsx = require('xlsx');
const fs = require('fs');
const redisClient = require('../../services/redis');
const logActivity = require('../utils/activityLogger');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const adminController = {
  async initializeAdmin() {
    try {
      // Check if admin already exists
      const params = {
        TableName: process.env.ADMINS_TABLE,
        Key: { email: process.env.ADMIN_EMAIL }
      };

      const command = new GetCommand(params);
      const result = await docClient.send(command);

      if (!result.Item) {
        // Create default admin user
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        
        const adminData = {
          email: process.env.ADMIN_EMAIL,
          password: hashedPassword,
          role: 'superadmin',
          createdAt: new Date().toISOString()
        };

        const createParams = {
          TableName: process.env.ADMINS_TABLE,
          Item: adminData
        };

        const createCommand = new PutCommand(createParams);
        await docClient.send(createCommand);
        
        console.log('✅ Default admin user created');
      } else {
        console.log('✅ Admin user already exists');
      }
    } catch (error) {
      console.error('❌ Failed to initialize admin user:', error);
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Get admin from database
      const params = {
        TableName: process.env.ADMINS_TABLE,
        Key: { email }
      };

      const command = new GetCommand(params);
      const result = await docClient.send(command);

      if (!result.Item) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const admin = result.Item;
      const isValidPassword = await bcrypt.compare(password, admin.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          email: admin.email, 
          role: admin.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        message: 'Login successful',
        token,
        admin: {
          email: admin.email,
          role: admin.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  },

  async createJob(req, res) {
    try {
      const jobData = {
        ...req.body,
        jobId: uuidv4(),
        postedOn: new Date().toISOString(),
        status: 'active'
      };

      // Validate required fields
      const requiredFields = ['role', 'companyName', 'location', 'salary', 'jobDescription', 'originalLink', 'category', 'expiresOn'];
      for (const field of requiredFields) {
        if (!jobData[field]) {
          return res.status(400).json({ error: `${field} is required` });
        }
      }

      const params = {
        TableName: process.env.JOBS_TABLE,
        Item: jobData
      };

      const command = new PutCommand(params);
      await docClient.send(command);
      // Log activity
      if (req.admin && req.admin.email) {
        await logActivity({
          action: 'added',
          targetType: 'job',
          targetId: jobData.jobId,
          adminEmail: req.admin.email,
        });
      }

      res.status(201).json({ message: 'Job created successfully', job: jobData });
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({ error: 'Failed to create job' });
    }
  },

  async bulkUploadJobs(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'File is required' });
      }

      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      const jobs = [];
      const errors = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const job = {
            jobId: uuidv4(),
            role: row.role,
            companyName: row.companyName,
            companyLogo: row.companyLogo,
            location: row.location,
            salary: row.salary,
            jobDescription: row.jobDescription,
            originalLink: row.originalLink,
            category: row.category,
            tags: row.tags ? (typeof row.tags === 'number' ? row.tags.toString().split(',').map(tag => tag.trim()) : row.tags.split(',').map(tag => tag.trim())) : [],
            batch: row.batch ? (typeof row.batch === 'number' ? row.batch.toString().split(',').map(batch => batch.trim()) : row.batch.split(',').map(batch => batch.trim())) : [],
            expiresOn: row.expiresOn,
            postedOn: new Date().toISOString(),
            status: 'active'
          };

          jobs.push(job);
        } catch (error) {
          errors.push({ row: i + 1, error: error.message });
        }
      }

      // Batch write to DynamoDB
      if (jobs.length > 0) {
        const batches = [];
        for (let i = 0; i < jobs.length; i += 25) {
          batches.push(jobs.slice(i, i + 25));
        }

        for (const batch of batches) {
          const params = {
            RequestItems: {
              [process.env.JOBS_TABLE]: batch.map(job => ({
                PutRequest: { Item: job }
              }))
            }
          };

          const command = new BatchWriteCommand(params);
          await docClient.send(command);
        }
      }

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      res.json({
        message: 'Bulk upload completed',
        successful: jobs.length,
        errors: errors.length,
        errorDetails: errors
      });
    } catch (error) {
      console.error('Error in bulk upload:', error);
      res.status(500).json({ error: 'Bulk upload failed' });
    }
  },

  async updateJob(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // First, find the job to get the category (partition key)
      const scanParams = {
        TableName: process.env.JOBS_TABLE,
        FilterExpression: 'jobId = :jobId',
        ExpressionAttributeValues: {
          ':jobId': id
        }
      };

      const scanCommand = new ScanCommand(scanParams);
      const scanResult = await docClient.send(scanCommand);

      if (!scanResult.Items || scanResult.Items.length === 0) {
        return res.status(404).json({ error: 'Job not found' });
      }

      const existingJob = scanResult.Items[0];

      // Build update expression
      let updateExpression = 'SET ';
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};
      
      Object.keys(updates).forEach((key, index) => {
        if (key !== 'jobId' && key !== 'category') { // Don't update keys
          updateExpression += `#${key} = :${key}`;
          if (index < Object.keys(updates).length - 1) updateExpression += ', ';
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = updates[key];
        }
      });

      const params = {
        TableName: process.env.JOBS_TABLE,
        Key: {
          category: existingJob.category,
          jobId: id
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      };

      const command = new UpdateCommand(params);
      const result = await docClient.send(command);
      // Log activity
      if (req.admin && req.admin.email) {
        await logActivity({
          action: 'updated',
          targetType: 'job',
          targetId: id,
          adminEmail: req.admin.email,
        });
      }

      // Invalidate Redis cache for this job and all jobs lists
      try {
        // Delete job detail cache
        await redisClient.del(`job:${id}`);
        // Delete all jobs list caches (keys starting with jobs:)
        if (redisClient.keys) {
          const keys = await redisClient.keys('jobs:*');
          if (Array.isArray(keys) && keys.length > 0) {
            await redisClient.del(keys);
          }
        }
      } catch (cacheErr) {
        console.warn('Failed to invalidate jobs cache:', cacheErr);
      }

      res.json({ message: 'Job updated successfully', job: result.Attributes });
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({ error: 'Failed to update job' });
    }
  },

  async deleteJob(req, res) {
    try {
      const { id } = req.params;

      // First, find the job to get the category (partition key)
      const scanParams = {
        TableName: process.env.JOBS_TABLE,
        FilterExpression: 'jobId = :jobId',
        ExpressionAttributeValues: {
          ':jobId': id
        }
      };

      const scanCommand = new ScanCommand(scanParams);
      const scanResult = await docClient.send(scanCommand);

      if (!scanResult.Items || scanResult.Items.length === 0) {
        // If not found, treat as already deleted (idempotent)
        return res.json({ message: 'Job deleted successfully (not found, already deleted)' });
      }

      // There could be multiple jobs with the same jobId in different categories (shouldn't happen, but handle it)
      for (const job of scanResult.Items) {
        const params = {
          TableName: process.env.JOBS_TABLE,
          Key: {
            category: job.category,
            jobId: id
          }
        };
        const command = new DeleteCommand(params);
        await docClient.send(command);
      }

      // Invalidate Redis cache for this job and all jobs lists
      try {
        // Delete job detail cache
        await redisClient.del(`job:${id}`);
        // Delete all jobs list caches (keys starting with jobs:)
        if (redisClient.keys) {
          const keys = await redisClient.keys('jobs:*');
          if (Array.isArray(keys) && keys.length > 0) {
            await redisClient.del(keys);
          }
        }
      } catch (cacheErr) {
        console.warn('Failed to invalidate jobs cache:', cacheErr);
      }
      // Log activity
      if (req.admin && req.admin.email) {
        await logActivity({
          action: 'deleted',
          targetType: 'job',
          targetId: id,
          adminEmail: req.admin.email,
        });
      }

      res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({ error: 'Failed to delete job' });
    }
  },

  async createSarkariJob(req, res) {
    try {
      const jobData = {
        ...req.body,
        jobId: uuidv4(),
        postedOn: new Date().toISOString(),
        status: 'active'
      };

      const requiredFields = ['postName', 'organization', 'officialWebsite', 'notificationLink'];
      for (const field of requiredFields) {
        if (!jobData[field]) {
          return res.status(400).json({ error: `${field} is required` });
        }
      }

      const params = {
        TableName: process.env.SARKARI_JOBS_TABLE,
        Item: jobData
      };

      const command = new PutCommand(params);
      await docClient.send(command);
      // Log activity
      if (req.admin && req.admin.email) {
        await logActivity({
          action: 'added',
          targetType: 'sarkari-job',
          targetId: jobData.jobId,
          adminEmail: req.admin.email,
        });
      }

      res.status(201).json({ message: 'Sarkari job created successfully', job: jobData });
    } catch (error) {
      console.error('Error creating sarkari job:', error);
      res.status(500).json({ error: 'Failed to create sarkari job' });
    }
  },

  async bulkUploadSarkariJobs(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'File is required' });
      }

      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      const jobs = [];
      const errors = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const job = {
            jobId: uuidv4(),
            postName: row.postName,
            organization: row.organization,
            advertisementNo: row.advertisementNo,
            importantDates: {
              applicationStart: row.applicationStart,
              applicationEnd: row.applicationEnd,
              examDate: row.examDate
            },
            applicationFee: row.applicationFee,
            vacancyDetails: row.vacancyDetails,
            eligibility: row.eligibility,
            officialWebsite: row.officialWebsite,
            notificationLink: row.notificationLink,
            applyLink: row.applyLink,
            resultLink: row.resultLink,
            createdAt: new Date().toISOString(),
            status: 'active'
          };

          jobs.push(job);
        } catch (error) {
          errors.push({ row: i + 1, error: error.message });
        }
      }

      // Batch write to DynamoDB
      if (jobs.length > 0) {
        const batches = [];
        for (let i = 0; i < jobs.length; i += 25) {
          batches.push(jobs.slice(i, i + 25));
        }

        for (const batch of batches) {
          const params = {
            RequestItems: {
              [process.env.SARKARI_JOBS_TABLE]: batch.map(job => ({
                PutRequest: { Item: job }
              }))
            }
          };

          const command = new BatchWriteCommand(params);
          await docClient.send(command);
        }
      }

      fs.unlinkSync(req.file.path);

      res.json({
        message: 'Sarkari jobs bulk upload completed',
        successful: jobs.length,
        errors: errors.length,
        errorDetails: errors
      });
    } catch (error) {
      console.error('Error in sarkari jobs bulk upload:', error);
      res.status(500).json({ error: 'Sarkari jobs bulk upload failed' });
    }
  },

  async updateSarkariJob(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Find the job first
      const scanParams = {
        TableName: process.env.SARKARI_JOBS_TABLE,
        FilterExpression: 'jobId = :jobId',
        ExpressionAttributeValues: {
          ':jobId': id
        }
      };

      const scanCommand = new ScanCommand(scanParams);
      const scanResult = await docClient.send(scanCommand);

      if (!scanResult.Items || scanResult.Items.length === 0) {
        return res.status(404).json({ error: 'Sarkari job not found' });
      }

      const existingJob = scanResult.Items[0];

      let updateExpression = 'SET ';
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};
      
      Object.keys(updates).forEach((key, index) => {
        if (key !== 'jobId' && key !== 'organization') {
          updateExpression += `#${key} = :${key}`;
          if (index < Object.keys(updates).length - 1) updateExpression += ', ';
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = updates[key];
        }
      });

      const params = {
        TableName: process.env.SARKARI_JOBS_TABLE,
        Key: {
          organization: existingJob.organization,
          jobId: id
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      };

      const command = new UpdateCommand(params);
      const result = await docClient.send(command);
      // Log activity
      if (req.admin && req.admin.email) {
        await logActivity({
          action: 'updated',
          targetType: 'sarkari-job',
          targetId: id,
          adminEmail: req.admin.email,
        });
      }

      // Invalidate Redis cache for this sarkari job and all sarkari jobs lists
      try {
        // Delete sarkari job detail cache
        await redisClient.del(`sarkari-job:${id}`);
        // Delete all sarkari jobs list caches (keys starting with sarkari-jobs:)
        if (redisClient.keys) {
          const keys = await redisClient.keys('sarkari-jobs:*');
          if (Array.isArray(keys) && keys.length > 0) {
            await redisClient.del(keys);
          }
        }
      } catch (cacheErr) {
        console.warn('Failed to invalidate sarkari jobs cache:', cacheErr);
      }

      res.json({ message: 'Sarkari job updated successfully', job: result.Attributes });
    } catch (error) {
      console.error('Error updating sarkari job:', error);
      res.status(500).json({ error: 'Failed to update sarkari job' });
    }
  },

  async deleteSarkariJob(req, res) {
    try {
      const { id } = req.params;

      const scanParams = {
        TableName: process.env.SARKARI_JOBS_TABLE,
        FilterExpression: 'jobId = :jobId',
        ExpressionAttributeValues: {
          ':jobId': id
        }
      };

      const scanCommand = new ScanCommand(scanParams);
      const scanResult = await docClient.send(scanCommand);

      if (!scanResult.Items || scanResult.Items.length === 0) {
        return res.status(404).json({ error: 'Sarkari job not found' });
      }

      const job = scanResult.Items[0];

      const params = {
        TableName: process.env.SARKARI_JOBS_TABLE,
        Key: {
          organization: job.organization,
          jobId: id
        }
      };

      const command = new DeleteCommand(params);
      await docClient.send(command);

      // Invalidate Redis cache for this sarkari job and all sarkari jobs lists
      try {
        // Delete sarkari job detail cache
        await redisClient.del(`sarkari-job:${id}`);
        // Delete all sarkari jobs list caches (keys starting with sarkari-jobs:)
        if (redisClient.keys) {
          const keys = await redisClient.keys('sarkari-jobs:*');
          if (Array.isArray(keys) && keys.length > 0) {
            await redisClient.del(keys);
          }
        }
      } catch (cacheErr) {
        console.warn('Failed to invalidate sarkari jobs cache:', cacheErr);
      }
      // Log activity
      if (req.admin && req.admin.email) {
        await logActivity({
          action: 'deleted',
          targetType: 'sarkari-job',
          targetId: id,
          adminEmail: req.admin.email,
        });
      }

      res.json({ message: 'Sarkari job deleted successfully' });
    } catch (error) {
      console.error('Error deleting sarkari job:', error);
      res.status(500).json({ error: 'Failed to delete sarkari job' });
    }
  },

  async createAdmin(req, res) {
    try {
      const { email, password, role } = req.body;
      if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required' });
      }
      // Check if admin already exists
      const params = {
        TableName: process.env.ADMINS_TABLE,
        Key: { email }
      };
      const command = new GetCommand(params);
      const result = await docClient.send(command);
      if (result.Item) {
        return res.status(409).json({ error: 'Admin with this email already exists' });
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const adminData = {
        email,
        password: hashedPassword,
        role,
        createdAt: new Date().toISOString()
      };
      const createParams = {
        TableName: process.env.ADMINS_TABLE,
        Item: adminData
      };
      const createCommand = new PutCommand(createParams);
      await docClient.send(createCommand);
      res.status(201).json({ message: 'Admin created successfully', admin: { email, role } });
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ error: 'Failed to create admin' });
    }
  },

  async getStats(req, res) {
    try {
      // Count private jobs
      const jobsParams = {
        TableName: process.env.JOBS_TABLE,
      };
      const jobsCommand = new ScanCommand(jobsParams);
      const jobsResult = await docClient.send(jobsCommand);
      const totalPrivateJobs = jobsResult.Items ? jobsResult.Items.length : 0;
      const activePrivateJobs = jobsResult.Items ? jobsResult.Items.filter(j => j.status === 'active').length : 0;

      // Count government jobs
      const sarkariParams = {
        TableName: process.env.SARKARI_JOBS_TABLE,
      };
      const sarkariCommand = new ScanCommand(sarkariParams);
      const sarkariResult = await docClient.send(sarkariCommand);
      const totalGovtJobs = sarkariResult.Items ? sarkariResult.Items.length : 0;
      const activeGovtJobs = sarkariResult.Items ? sarkariResult.Items.filter(j => j.status === 'active').length : 0;

      // Count certifications
      let totalCertifications = 0;
      if (process.env.CERTIFICATIONS_TABLE) {
        const certParams = {
          TableName: process.env.CERTIFICATIONS_TABLE,
        };
        const certCommand = new ScanCommand(certParams);
        const certResult = await docClient.send(certCommand);
        totalCertifications = certResult.Items ? certResult.Items.length : 0;
      }

      // Count subscriptions
      let totalSubscriptions = 0;
      if (process.env.SUBSCRIPTIONS_TABLE) {
        const subsParams = {
          TableName: process.env.SUBSCRIPTIONS_TABLE,
        };
        const subsCommand = new ScanCommand(subsParams);
        const subsResult = await docClient.send(subsCommand);
        totalSubscriptions = subsResult.Items ? subsResult.Items.length : 0;
      }

      res.json({
        totalPrivateJobs,
        activePrivateJobs,
        totalGovtJobs,
        activeGovtJobs,
        totalCertifications,
        totalSubscriptions
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  },

  async getRecentActivity(req, res) {
    try {
      const AWS = require('aws-sdk');
      const dynamoDb = new AWS.DynamoDB.DocumentClient();
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const params = {
        TableName: 'AdminActivities',
      };
      const data = await dynamoDb.scan(params).promise();
      const sorted = data.Items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const total = sorted.length;
      const start = (page - 1) * limit;
      const end = start + limit;
      const activities = sorted.slice(start, end);
      res.json({
        activities,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      });
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      res.status(500).json({ error: 'Failed to fetch recent activities' });
    }
  }
};

module.exports = adminController;