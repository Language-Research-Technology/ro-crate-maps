const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const { ROCrate } = require('ro-crate');
const { SossValidator } = require('../lib/soss-validator');

describe('SoSS+ Validator Tests', function() {
  this.timeout(10000); // Allow enough time for file operations

  // Profile crate paths
  const rocProfileCratePath = path.join(
    __dirname, 
    '../profiles/ro-crate/profile-crate/ro-crate-metadata.json'
  );

  const ldacProfileCratePath = path.join(
    __dirname, 
    '../profiles/ldac/profile-crate/ro-crate-metadata.json'
  );


  // Sample target crate path for testing
  const sampleCratePath = path.join(
    __dirname, 
    '../test_data/sample-ro-crate-metadata.json'
  );

  let rocrateProfileCrate;
  let sampleCrate;
  function setup() {
      console.log('--- SETUP ---');
      // Load RO-Crate profile crate
      console.log('Loading RO-Crate profile crate from:', rocProfileCratePath);
      const profileData = fs.readFileSync(rocProfileCratePath, 'utf8');
      const profileJson = JSON.parse(profileData);
      rocrateProfileCrate = new ROCrate(profileJson, { array: true, link: true });


      rocrateProfileCrate = new ROCrate(profileJson, { array: true, link: true });
      
      // Load sample target crate
      const sampleCrateData = fs.readFileSync(sampleCratePath, 'utf8');
      const targetJson = JSON.parse(sampleCrateData);
      sampleCrate = new ROCrate(targetJson, { array: true, link: true });
  }
  // Load the crates before running tests
  before(function() {
      setup();
  });
  
  
  it('should be able to follow the basic RO-Crate rules', async function() {
    // Create a validator with the profile crate
    const validator = new SossValidator(rocrateProfileCrate);
    validator.parseRules();
    console.log(validator.rules);
    expect(validator.rules.rootClassRule.id).to.equal("#RO-Crate_Metadata_Descriptor")
    expect(Object.keys(validator.rules.classes).length).to.equal(2);
    expect (validator.rules.classes["#RO-Crate_Metadata_Descriptor"].propertyRules.length).to.equal(2);
    expect (validator.rules.classes["#RO-Crate_Metadata_Descriptor"].entity["@id"]).to.equal("#RO-Crate_Metadata_Descriptor");




 
  });
  
  
});