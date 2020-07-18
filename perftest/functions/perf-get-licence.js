const Log = require('@dazn/lambda-powertools-logger');
const { QldbDriver } = require('amazon-qldb-driver-nodejs')
const qldbDriver = new QldbDriver("qldb-simple-demo-dev")

module.exports.handler = async (event) => {
    const { licenceid } = event.pathParameters;
    console.log(`In perfTest function with ${licenceid}`);
    console.log(`** PRINT MSG: ${JSON.stringify(event, null, 2)}`);

    const response = await qldbDriver.executeLambda(async txn => {
      const query = `SELECT * FROM BicycleLicence AS b WHERE b.LicenceId = ?`;
      console.log(`About to execute the transaction with ${licenceid}`);
 
      const result = await getLicenceRecordById(txn, licenceid);

      console.log(`I am now back from the query`);
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

async function getLicenceRecordById(txn, id) {
  Log.debug("In getLicenceRecordById function");
  const query = `SELECT * FROM BicycleLicence AS b WHERE b.LicenceId = ?`;
  return txn.execute(query, id);
};