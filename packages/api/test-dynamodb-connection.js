require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ListTablesCommand } = require('@aws-sdk/lib-dynamodb');

async function testDynamoDBConnection() {
  try {
    console.log('Testing DynamoDB connection...');
    console.log('AWS Region:', process.env.AWS_REGION);
    console.log('AWS Access Key ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not set');
    console.log('AWS Secret Access Key:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set');
    
    const client = new DynamoDBClient({ 
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    
    const docClient = DynamoDBDocumentClient.from(client);
    
    // Test basic connectivity by listing tables
    const command = new ListTablesCommand({});
    const result = await docClient.send(command);
    
    console.log('✅ DynamoDB connection successful!');
    console.log('Available tables:', result.TableNames);
    
    // Check if required tables exist
    const requiredTables = [
      process.env.JOBS_TABLE,
      process.env.SARKARI_JOBS_TABLE,
      process.env.ADMINS_TABLE,
      process.env.SUBSCRIPTIONS_TABLE,
      process.env.INTERNSHIPS_TABLE,
      process.env.WALKING_TABLE,
      process.env.CERTIFICATIONS_TABLE
    ].filter(Boolean);
    
    console.log('\nRequired tables:');
    requiredTables.forEach(table => {
      const exists = result.TableNames.includes(table);
      console.log(`  ${table}: ${exists ? '✅' : '❌'}`);
    });
    
  } catch (error) {
    console.error('❌ DynamoDB connection failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode
    });
  }
}

testDynamoDBConnection();
