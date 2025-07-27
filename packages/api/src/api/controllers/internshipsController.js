const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, DeleteCommand, UpdateCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
exports.uploadMiddleware = upload.single('file');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.INTERNSHIPS_TABLE || 'internships';

// Helper function to get company logo
async function getCompanyLogo(companyName) {
  try {
    const response = await axios.get(`https://logo.clearbit.com/${companyName.toLowerCase().replace(/\s+/g, '')}.com`, {
      timeout: 5000,
      validateStatus: function (status) {
        return status < 400; // Accept status codes less than 400
      }
    });
    return response.request.res.responseUrl;
  } catch (error) {
    console.log(`Could not fetch logo for ${companyName}:`, error.message);
    return '/placeholder-logo.svg';
  }
}

// Get all internships with optional filtering
exports.getAllInternships = async (req, res) => {
  try {
    const { category, location, duration, q: searchTerm, page = 1, limit = 15 } = req.query;
    const offset = (page - 1) * limit;

    let params = {
      TableName: TABLE_NAME,
      FilterExpression: '#isActive = :active',
      ExpressionAttributeNames: {
        '#isActive': 'isActive'
      },
      ExpressionAttributeValues: {
        ':active': true
      }
    };

    // Add category filter
    if (category) {
      params.FilterExpression += ' AND category = :category';
      params.ExpressionAttributeValues[':category'] = category;
    }

    // Add location filter
    if (location) {
      params.FilterExpression += ' AND contains(#location, :location)';
      params.ExpressionAttributeNames['#location'] = 'location';
      params.ExpressionAttributeValues[':location'] = location;
    }

    // Add duration filter
    if (duration) {
      params.FilterExpression += ' AND contains(#duration, :duration)';
      params.ExpressionAttributeNames['#duration'] = 'duration';
      params.ExpressionAttributeValues[':duration'] = duration;
    }

    // Add search term filter
    if (searchTerm) {
      params.FilterExpression += ' AND (contains(#title, :searchTerm) OR contains(company, :searchTerm))';
      params.ExpressionAttributeNames['#title'] = 'title';
      params.ExpressionAttributeValues[':searchTerm'] = searchTerm;
    }

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    let internships = result.Items || [];
    
    // Sort by posted date (newest first)
    internships.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

    // Paginate
    const paginatedInternships = internships.slice(offset, offset + parseInt(limit));

    const response = {
      internships: paginatedInternships,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(internships.length / limit),
        totalInternships: internships.length,
        hasNext: offset + parseInt(limit) < internships.length,
        hasPrev: page > 1
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internships',
      error: error.message
    });
  }
};

// Get internship by ID
exports.getInternshipById = async (req, res) => {
  try {
    const { id } = req.params;

    // Since we need to search by id (sort key), we need to scan
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': id
      }
    };

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    const internship = result.Items[0];

    res.json({
      success: true,
      internship
    });
  } catch (error) {
    console.error('Error fetching internship:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internship',
      error: error.message
    });
  }
};

// Create new internship
exports.createInternship = async (req, res) => {
  try {
    const { title, company, location, startDate, endDate, stipend, duration, applyLink, description, skills, category } = req.body;

    if (!title || !company || !location || !applyLink || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, company, location, applyLink, category'
      });
    }

    const id = `intern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // Get company logo
    const companyLogo = await getCompanyLogo(company);

    const internshipData = {
      id,
      title,
      company,
      companyLogo,
      location,
      startDate: startDate || '',
      endDate: endDate || '',
      stipend: stipend || 'Not specified',
      duration: duration || 'Not specified',
      applyLink,
      description: description || '',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      category,
      postedAt: now,
      lastUpdated: now,
      isActive: true
    };

    const params = {
      TableName: TABLE_NAME,
      Item: internshipData
    };

    const command = new PutCommand(params);
    await docClient.send(command);

    res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      internship: internshipData
    });
  } catch (error) {
    console.error('Error creating internship:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create internship',
      error: error.message
    });
  }
};

// Update internship
exports.updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // First, find the internship to get the category (partition key)
    const scanParams = {
      TableName: TABLE_NAME,
      FilterExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': id
      }
    };

    const scanCommand = new ScanCommand(scanParams);
    const scanResult = await docClient.send(scanCommand);

    if (!scanResult.Items || scanResult.Items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    const existingInternship = scanResult.Items[0];
    const newCategory = updates.category;
    const oldCategory = existingInternship.category;

    // Check if category is being changed
    if (newCategory && newCategory !== oldCategory) {
      // Category is changing - we need to create a new item and delete the old one
      console.log(`Moving internship ${id} from category "${oldCategory}" to "${newCategory}"`);
      
      // Get company logo if company is being updated
      let companyLogo = existingInternship.companyLogo;
      if (updates.company && updates.company !== existingInternship.company) {
        companyLogo = await getCompanyLogo(updates.company);
      }

      // Create new item with updated category
      const newInternshipData = {
        ...existingInternship,
        ...updates,
        category: newCategory,
        companyLogo,
        lastUpdated: new Date().toISOString()
      };

      // Put the new item
      const putParams = {
        TableName: TABLE_NAME,
        Item: newInternshipData
      };
      const putCommand = new PutCommand(putParams);
      await docClient.send(putCommand);

      // Delete the old item
      const deleteParams = {
        TableName: TABLE_NAME,
        Key: {
          category: oldCategory,
          id: id
        }
      };
      const deleteCommand = new DeleteCommand(deleteParams);
      await docClient.send(deleteCommand);

      res.json({
        success: true,
        message: `Internship updated successfully and moved from "${oldCategory}" to "${newCategory}"`,
        internship: newInternshipData
      });
    } else {
      // Category is not changing - do normal update
      let updateExpression = 'SET ';
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};
      
      Object.keys(updates).forEach((key, index) => {
        if (key !== 'id' && key !== 'category') { // Don't update keys
          updateExpression += `#${key} = :${key}`;
          if (index < Object.keys(updates).length - 1) updateExpression += ', ';
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = updates[key];
        }
      });

      // Add lastUpdated
      updateExpression += ', lastUpdated = :lastUpdated';
      expressionAttributeValues[':lastUpdated'] = new Date().toISOString();

      const params = {
        TableName: TABLE_NAME,
        Key: {
          category: existingInternship.category,
          id: id
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      };

      const command = new UpdateCommand(params);
      const result = await docClient.send(command);

      res.json({
        success: true,
        message: 'Internship updated successfully',
        internship: result.Attributes
      });
    }
  } catch (error) {
    console.error('Error updating internship:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update internship',
      error: error.message
    });
  }
};

// Delete internship
exports.deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;

    // First, find the internship to get the category (partition key)
    const scanParams = {
      TableName: TABLE_NAME,
      FilterExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': id
      }
    };

    const scanCommand = new ScanCommand(scanParams);
    const scanResult = await docClient.send(scanCommand);

    if (!scanResult.Items || scanResult.Items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    const internship = scanResult.Items[0];

    const params = {
      TableName: TABLE_NAME,
      Key: {
        category: internship.category,
        id: id
      }
    };

    const command = new DeleteCommand(params);
    await docClient.send(command);

    res.json({
      success: true,
      message: 'Internship deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting internship:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete internship',
      error: error.message
    });
  }
};

// Get internships by category
exports.getInternshipsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 15 } = req.query;
    const offset = (page - 1) * limit;

    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'category = :category',
      FilterExpression: '#isActive = :active',
      ExpressionAttributeNames: {
        '#isActive': 'isActive'
      },
      ExpressionAttributeValues: {
        ':category': category,
        ':active': true
      }
    };

    const command = new QueryCommand(params);
    const result = await docClient.send(command);

    let internships = result.Items || [];
    
    // Sort by posted date (newest first)
    internships.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

    // Paginate
    const paginatedInternships = internships.slice(offset, offset + parseInt(limit));

    const response = {
      internships: paginatedInternships,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(internships.length / limit),
        totalInternships: internships.length,
        hasNext: offset + parseInt(limit) < internships.length,
        hasPrev: page > 1
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching internships by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internships by category',
      error: error.message
    });
  }
};

// Bulk upload internships from CSV
exports.bulkUploadInternships = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const results = [];
    const errors = [];

    // Parse CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        try {
          const createdInternships = [];
          const now = new Date().toISOString();

          for (const row of results) {
            try {
              // Validate required fields
              if (!row.title || !row.company || !row.location || !row.applyLink || !row.category) {
                errors.push(`Row missing required fields: ${JSON.stringify(row)}`);
                continue;
              }

              const id = `intern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              
              // Get company logo
              const companyLogo = await getCompanyLogo(row.company);

              const internshipData = {
                id,
                title: row.title.trim(),
                company: row.company.trim(),
                companyLogo,
                location: row.location.trim(),
                startDate: row.startDate || '',
                endDate: row.endDate || '',
                stipend: row.stipend || 'Not specified',
                duration: row.duration || 'Not specified',
                applyLink: row.applyLink.trim(),
                description: row.description || '',
                skills: row.skills ? row.skills.split(',').map(s => s.trim()) : [],
                category: row.category.trim(),
                postedAt: now,
                lastUpdated: now,
                isActive: true
              };

              const params = {
                TableName: TABLE_NAME,
                Item: internshipData
              };

              const command = new PutCommand(params);
              await docClient.send(command);

              createdInternships.push(internshipData);
            } catch (error) {
              errors.push(`Error processing row: ${JSON.stringify(row)} - ${error.message}`);
            }
          }

          // Clean up uploaded file
          fs.unlinkSync(req.file.path);

          res.json({
            success: true,
            message: `Successfully created ${createdInternships.length} internships`,
            created: createdInternships.length,
            errors: errors.length > 0 ? errors : undefined
          });
        } catch (error) {
          console.error('Error in bulk upload:', error);
          res.status(500).json({
            success: false,
            message: 'Failed to process bulk upload',
            error: error.message
          });
        }
      });
  } catch (error) {
    console.error('Error in bulk upload:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload internships',
      error: error.message
    });
  }
}; 