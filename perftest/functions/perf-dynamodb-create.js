const DynamoDB = require('aws-sdk/clients/dynamodb')
const documentClient = new DynamoDB.DocumentClient()


module.exports.handler = async (event) => {
  console.log(`** PRINT MSG: ${JSON.stringify(event, null, 2)}`);
  const { GovId, FirstName, LastName, DOB, GovIdType, Address } = JSON.parse(event.body);
  console.log(`In the perf-dynamodb-create handler with GovId ${GovId} FirstName ${FirstName} LastName ${LastName} DOB ${DOB} and Address ${Address}`);

  await createPerson(GovId, FirstName, LastName, DOB, GovIdType, Address);

  return {
        statusCode: 201,
        body: '{"Status": "Person created"}'
  };
}


const createPerson = async (GovId, FirstName, LastName, DOB, GovIdType, Address) => {

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      GovId: GovId,
      FirstName: FirstName,
      LastName: LastName,
      DOB: DOB,
      GovIdType: GovIdType,
      Address: Address
    },
  };

  await documentClient.put(params, (err) => {
    if (err) {
      console.error('Unable to add person', GovId, '. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('PutItem succeeded:', GovId);
    }
  }).promise()

}
