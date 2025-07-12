const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function logActivity({ action, targetType, targetId, adminEmail }) {
  const params = {
    TableName: 'AdminActivities',
    Item: {
      id: uuidv4(),
      action,
      targetType,
      targetId,
      adminEmail,
      timestamp: Date.now(),
    },
  };
  await dynamoDb.put(params).promise();
}

module.exports = logActivity; 