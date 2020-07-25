const DynamoDB = require('aws-sdk/clients/dynamodb');
const documentClient = new DynamoDB.DocumentClient();

const getData = async () => {

    const person = await getPerson();

    person.Items.forEach(function (id) {
        console.log(id.GovId);
    });

}

const getPerson = async () => {
    const person = await documentClient.scan({
      TableName: 'Person-dev'
    }).promise();
  
    return person;
}

getData();