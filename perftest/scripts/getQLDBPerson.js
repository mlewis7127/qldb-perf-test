const { QldbDriver } = require('amazon-qldb-driver-nodejs');
const qldbDriver = new QldbDriver('qldb-perf-demo-dev');

const getData = async () => {
    const response = await qldbDriver.executeLambda(async txn => {
        const result = await getPeople(txn);
        const values = result.getResultList();

        values.forEach(function (id, index) {
            console.log(id.get("GovId").stringValue());
        });
    })
}

const getPeople = async (txn) => {
    return txn.execute('SELECT GovId FROM Person');
}

getData();