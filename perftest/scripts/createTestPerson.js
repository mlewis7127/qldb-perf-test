'use strict';

module.exports = {
  createTestPerson
};

// Make sure to "npm install faker" first.
const Faker = require('faker');

function createTestPerson(userContext, events, done) {
  // generate data with Faker:
  const firstName = `${Faker.name.firstName()}`;
  const lastName = `${Faker.name.lastName()}`;
  const govIdType = "Driving Licence";
  const address = Faker.address.streetName() + ', ' + Faker.address.city() + ', ' + Faker.address.state() + ', ' + Faker.address.zipCode();
  const govid = `${lastName.toUpperCase() + Math.floor(1000 + Math.random() * 9000)}`;
  let dob = Faker.date.past(50, new Date("Sat Sep 20 1992 21:35:02 GMT+0200 (CEST)"));
  dob = dob.getFullYear() + "-" + (dob.getMonth()+1) + "-" + dob.getDate();  // First month is "1"

  // add variables to virtual user's context:
  userContext.vars.govid = govid;
  userContext.vars.firstName = firstName;
  userContext.vars.lastName = lastName;
  userContext.vars.dob = dob;
  userContext.vars.govIdType = govIdType;
  userContext.vars.address = address;

  // continue with executing the scenario:
  return done();
}