const { QldbDriver } = require('amazon-qldb-driver-nodejs');
const qldbDriver = new QldbDriver(process.env.LEDGER_NAME);

const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

module.exports.handler = async (event) => {
  console.log(`** PRINT MSG: ${JSON.stringify(event, null, 2)}`);

  const { govid } = event.pathParameters;
    console.log(`In perf-qldb function with ${govid}`);

    const response = await qldbDriver.executeLambda(async txn => {
      const result = await getLicenceRecordById(txn, govid);
      const values = result.getResultList();
      const message = JSON.stringify(values[0]);
      return message;
    })

    const licence = JSON.parse(response);

    return {
        statusCode: 200,
        body: JSON.stringify(licence)
    };
}


const getLicenceRecordById = async (txn, id) => {
  const query = `SELECT * FROM Person AS b WHERE b.GovId = ?`;
  return txn.execute(query, id);
}
