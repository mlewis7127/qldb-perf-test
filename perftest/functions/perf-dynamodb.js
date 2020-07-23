const DynamoDB = require('aws-sdk/clients/dynamodb')
const documentClient = new DynamoDB.DocumentClient()


module.exports.handler = async (event) => {
    const { govid } = event.pathParameters;
    console.log(`In perf-dynamodb function with ${govid}`);
    console.log(`** PRINT MSG: ${JSON.stringify(event, null, 2)}`);

    const person = await getPerson(govid);
    return {
        statusCode: 200,
        body: JSON.stringify(person)
    };
}


const getPerson = async (id) => {
  const person = await documentClient.get({
    TableName: process.env.TABLE_NAME,
    Key: { GovId: id },
  }).promise();

  return {
    GovId: person.Item.GovId,
    FirstName: person.Item.FirstName,
    LastName: person.Item.LastName,
    DOB: person.Item.DOB,
    GovIdType: person.Item.GovIdType,
    Address: person.Item.Address
  };
}
