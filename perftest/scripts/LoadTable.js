/* eslint-disable no-console */
const fs = require('fs');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-west-1' });

const docClient = new AWS.DynamoDB.DocumentClient();

if (process.argv.length !== 3) {
  console.log('Error: expected to receive table name as an argument e.g. node LoadTable <table>');
  process.exit(1);
}
const tableName = process.argv[2];

console.log('Importing questions into DynamoDB. Please wait.');

const persons = JSON.parse(fs.readFileSync('person.json', 'utf8'));
persons.forEach((person) => {
  const params = {
    TableName: tableName,
    Item: {
      GovId: person.GovId,
      FirstName: person.FirstName,
      LastName: person.LastName,
      DOB: person.DOB,
      GovIdType: person.GovIdType,
      Address: person.Address
    },
  };

  docClient.put(params, (err) => {
    if (err) {
      console.error('Unable to add person', person.GovId, '. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('PutItem succeeded:', person.GovId);
    }
  });
});