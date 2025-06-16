const axios = require('axios');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const aiController = {
  async analyzeCv(req, res) {
    try {
      const { jobId, cvS3Key } = req.body;

      if (!jobId || !cvS3Key) {
        return res.status(400).json({ error: 'jobId and cvS3Key are required' });
      }

      // Fetch job details from DynamoDB
      const jobParams = {
        TableName: process.env.JOBS_TABLE,
        FilterExpression: 'jobId = :jobId',
        ExpressionAttributeValues: {
          ':jobId': jobId
        }
      };

      const jobCommand = new ScanCommand(jobParams);
      const jobResult = await docClient.send(jobCommand);

      if (!jobResult.Items || jobResult.Items.length === 0) {
        return res.status(404).json({ error: 'Job not found' });
      }

      const job = jobResult.Items[0];

      // Fetch CV from S3
      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: cvS3Key
      };

      const s3Command = new GetObjectCommand(s3Params);
      const s3Result = await s3Client.send(s3Command);
      
      // Convert stream to string (assuming text CV)
      const cvContent = await streamToString(s3Result.Body);

      // Prepare prompt for Gemini API
      const prompt = `
        Analyze the following CV against this job description and provide a structured response:

        JOB DETAILS:
        Role: ${job.role}
        Company: ${job.companyName}
        Location: ${job.location}
        Job Description: ${job.jobDescription}
        Required Skills/Tags: ${job.tags ? job.tags.join(', ') : 'Not specified'}

        CV CONTENT:
        ${cvContent}

        Please provide a JSON response with the following structure:
        {
          "compatibilityScore": <number between 0-100>,
          "strengths": [<array of 3-5 key strengths that match the job>],
          "weaknesses": [<array of 2-4 areas that need improvement>],
          "improvements": [<array of 3-5 specific suggestions for improvement>],
          "matchingSkills": [<array of skills from CV that match job requirements>],
          "missingSkills": [<array of important skills missing from CV>]
        }
      `;

      // Call Gemini API (mock implementation - replace with actual API call)
      const geminiResponse = await callGeminiAPI(prompt);

      // Get suggested jobs based on CV analysis
      const suggestedJobs = await getSuggestedJobs(geminiResponse.matchingSkills, jobId);

      const response = {
        analysis: geminiResponse,
        suggestedJobs: suggestedJobs
      };

      res.json(response);
    } catch (error) {
      console.error('Error analyzing CV:', error);
      res.status(500).json({ 
        error: 'CV analysis failed',
        message: 'Unable to analyze CV at this time. Please try again later.'
      });
    }
  }
};

// Helper function to convert stream to string
async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

// Mock Gemini API call (replace with actual implementation)
async function callGeminiAPI(prompt) {
  try {
    // This is a mock response - replace with actual Gemini API call
    if (process.env.GEMINI_API_KEY) {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GEMINI_API_KEY
          }
        }
      );

      // Parse the response and extract JSON
      const generatedText = response.data.candidates[0].content.parts[0].text;
      return JSON.parse(generatedText);
    } else {
      // Mock response for development
      return {
        compatibilityScore: Math.floor(Math.random() * 40) + 60, // 60-100
        strengths: [
          "Strong technical background in relevant technologies",
          "Good educational qualifications",
          "Relevant work experience",
          "Problem-solving skills demonstrated"
        ],
        weaknesses: [
          "Limited experience with specific frameworks mentioned in job",
          "Could improve communication skills section",
          "Missing some industry certifications"
        ],
        improvements: [
          "Add more specific project details and outcomes",
          "Include relevant certifications or courses",
          "Highlight leadership and teamwork experiences",
          "Quantify achievements with numbers and metrics",
          "Tailor skills section to match job requirements"
        ],
        matchingSkills: ["JavaScript", "React", "Node.js", "Problem Solving"],
        missingSkills: ["AWS", "Docker", "Kubernetes", "CI/CD"]
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

// Get suggested jobs based on matching skills
async function getSuggestedJobs(matchingSkills, currentJobId) {
  try {
    const params = {
      TableName: process.env.JOBS_TABLE,
      FilterExpression: '#status = :active AND jobId <> :currentJobId',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':active': 'active',
        ':currentJobId': currentJobId
      }
    };

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    // Score jobs based on skill matches
    const scoredJobs = result.Items.map(job => {
      const jobTags = job.tags || [];
      const matchCount = matchingSkills.filter(skill => 
        jobTags.some(tag => tag.toLowerCase().includes(skill.toLowerCase()))
      ).length;
      
      return {
        ...job,
        matchScore: matchCount
      };
    });

    // Sort by match score and return top 5
    return scoredJobs
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5)
      .map(job => ({
        jobId: job.jobId,
        role: job.role,
        companyName: job.companyName,
        location: job.location,
        matchScore: job.matchScore
      }));
  } catch (error) {
    console.error('Error getting suggested jobs:', error);
    return [];
  }
}

module.exports = aiController;