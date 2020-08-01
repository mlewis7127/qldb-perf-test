const { QldbDriver } = require('amazon-qldb-driver-nodejs');
const qldbDriver = new QldbDriver(process.env.LEDGER_NAME);

const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

module.exports.handler = async (event) => {
  console.log(`** PRINT MSG: ${JSON.stringify(event, null, 2)}`);
  const { GovId, FirstName, LastName, DOB, GovIdType, Address } = JSON.parse(event.body);
  console.log(`In the perf-qldb-create handler with GovId ${GovId} FirstName ${FirstName} LastName ${LastName} DOB ${DOB} and Address ${Address}`);
  const personDoc = [{"GovId": GovId, "FirstName": FirstName, "LastName": LastName, "DOB": DOB, "GovIdType": GovIdType, "Address": Address  }]
  let success = false;

  await qldbDriver.executeLambda(async txn => {
    const count = await checkUnique(txn, GovId);
    if (count === 0) {
      const result = await createPerson(txn, personDoc);
      const docIdArray = result.getResultList()
      const docId = docIdArray[0].get("documentId").stringValue();      
      await addGuid(txn, docId, GovId);
      success = true;
    } 
  }); 
  if (success) {
    return {
      statusCode: 201,
      body: '{"Status": "Person created"}'
    };    
  } else {
    return {
      statusCode: 400,
      body: '{"Status": "Person not created"}'
    };    
  }

}


const createPerson = async (txn, personDoc) => {
  const query = `INSERT INTO Person ?`;
  return txn.execute(query, personDoc);
}

const addGuid = async(txn, id, govid) => {
  const statement = `UPDATE Person as b SET b.GUID = ? WHERE b.GovId = ?`;
  return await txn.execute(statement, id, govid);
};

const checkUnique = async(txn, id) => {
  let count;
  const query = `SELECT GovId FROM Person AS b WHERE b.GovId = ?`;
  await txn.execute(query, id).then((result) => {
    count = result.getResultList().length;
  });
  return count;
}