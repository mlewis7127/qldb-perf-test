const { QldbDriver } = require('amazon-qldb-driver-nodejs');
const qldbDriver = new QldbDriver('qldb-perf-demo-dev');

module.exports.handler = async (event) => {
    const { govid } = event.pathParameters;
    console.log(`In perf-qldb function with ${govid}`);
    console.log(`** PRINT MSG: ${JSON.stringify(event, null, 2)}`);

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
