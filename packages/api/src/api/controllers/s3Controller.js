const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const s3Controller = {
  async getPreSignedUrl(req, res) {
    try {
      const { fileType = 'application/pdf' } = req.query;
      
      // Generate unique key for the file
      const key = `cvs/${uuidv4()}-${Date.now()}`;
      
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
        Metadata: {
          uploadedAt: new Date().toISOString()
        }
      });

      // Generate pre-signed URL (expires in 5 minutes)
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

      res.json({
        uploadUrl: signedUrl,
        key: key,
        expiresIn: 300
      });
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      res.status(500).json({ error: 'Failed to generate upload URL' });
    }
  }
};

module.exports = s3Controller;