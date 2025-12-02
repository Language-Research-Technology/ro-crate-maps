const { expect } = require("chai");
const path = require("path");
const fs = require("fs");
const { ROCrate } = require("ro-crate");
const { SossValidator } = require("../lib/soss-validator");

describe("SoSS+ Validator Tests", function () {
  this.timeout(10000); // Allow enough time for file operations

  // Profile crate paths
  const rocProfileCratePath = path.join(
    __dirname,
    "../profiles/ro-crate/profile-crate/ro-crate-metadata.json"
  );

  const ldacProfileCratePath = path.join(
    __dirname,
    "../profiles/ldac/profile-crate/ro-crate-metadata.json"
  );

  // Sample target crate path for testing
  const sampleCratePath = path.join(
    __dirname,
    "../test_data/sample-ro-crate-metadata.json"
  );

  let rocrateProfileCrate;
  let sampleCrate;
  function setup() {
    console.log("--- SETUP ---");
    // Load RO-Crate profile crate
    console.log("Loading RO-Crate profile crate from:", rocProfileCratePath);
    const profileData = fs.readFileSync(rocProfileCratePath, "utf8");
    const profileJson = JSON.parse(profileData);
    rocrateProfileCrate = new ROCrate(profileJson, { array: true, link: true });

    rocrateProfileCrate = new ROCrate(profileJson, { array: true, link: true });

    // Load sample target crate
    const sampleCrateData = fs.readFileSync(sampleCratePath, "utf8");
    const targetJson = JSON.parse(sampleCrateData);
    sampleCrate = new ROCrate(targetJson, { array: true, link: true });
  }
  // Load the crates before running tests
  before(function () {
    setup();
  });
  /*

  it('should load the SoSS+ profile crate from path', function() {
    const validator = new SossValidator(rocProfileCratePath);
    const result = validator.loadProfileCrate();
    expect(result).to.be.true;
  });
  
  it('should accept a crate object in constructor', function() {
    const validator = new SossValidator(rocrateProfileCrate);
    expect(validator.profileCrate).to.equal(rocrateProfileCrate);
  });
  */

  it("should be able to follow the basic RO-Crate rules", async function () {
    // Create a validator with the profile crate
    const validator = new SossValidator(rocrateProfileCrate);
    validator.parseRules();

    const targetCrate = new ROCrate({ array: true, link: true });
    var results = await validator.validateCrate(targetCrate);
    expect(results).to.have.property("error");

    //console.log(JSON.stringify(results, null, 2));

    expect(
      results.rules["#Root_Data_Entity"]["./"]["property-errors"]
    ).to.deep.include({
      message: 'Property "name" validation failed for entity ./',
    });

    expect(
      results.rules["#Root_Data_Entity"]["./"]["property-errors"]
    ).to.deep.include({
      message: 'Property "description" validation failed for entity ./',
    });

    expect(
      results.rules["#Root_Data_Entity"]["./"]["property-errors"]
    ).to.deep.include({
      message: 'Property "license" validation failed for entity ./',
    });

    targetCrate.root.name = "Test Dataset";

    targetCrate.root.license = "CC By-NC 4.0";

    targetCrate.root.datePublished = "JULY";
    results = await validator.validateCrate(targetCrate);

    expect(
      results.rules["#Root_Data_Entity"]["./"]["property-errors"]
    ).to.deep.include({
      message: 'Property "datePublished" validation failed for entity ./',
    });

    targetCrate.root.datePublished = "2023-07-01";

    targetCrate.root.description = "This is an RO-Crate";
    results = await validator.validateCrate(targetCrate);
    //console.log("Metadata Descriptor:", JSON.stringify(targetCrate.getEntity("ro-crate-metadata.json"), null, 2));
    expect(results.error.length).to.equal(0);
 
  });

  it("should be able to deal with multiple required types on Root Data Entity", async function () {
    // Create a validator with the profile crate
    setup();
    let validator = new SossValidator(rocrateProfileCrate);
    const targetCrate = new ROCrate({ array: true, link: true });
    var results = await validator.validateCrate(targetCrate);
    targetCrate.root.name = "Test Dataset";
    targetCrate.root.license = "CC By-NC 4.0";
    targetCrate.root.datePublished = "2023-07-01";
    targetCrate.root.description = "This is an RO-Crate";
    // Normal crate
    results = await validator.validateCrate(targetCrate);
    expect(results.error.length).to.equal(0);

    // Now modify the Root Data Entity in the profile crate
    const rootDataEntity = rocrateProfileCrate.getEntity("#Root_Data_Entity");
    rocrateProfileCrate.addValues(rootDataEntity, "prov:specializationOf", {
      "@id": "http://schema.org/HairSalon",
    });
    // New validator with the modified profile crate
    validator = new SossValidator(rocrateProfileCrate);

    results = await validator.validateCrate(targetCrate);
    //console.log("Results:", JSON.stringify(results, null, 2));
    //console.log(JSON.stringify(targetCrate.root, null, 2));
    expect(results.error.length).to.equal(1);

    // Add the required types to the target crate
    targetCrate.root["@type"] = ["HairSalon", "Dataset"];
    results = await validator.validateCrate(targetCrate);
    expect(results.error.length).to.equal(0);

    // Add more than the required type to the target crate
    targetCrate.root["@type"] = ["HairSalon", "Dataset", "AnimalShelter"];
    results = await validator.validateCrate(targetCrate);
    expect(results.error.length).to.equal(0);
  });

  it('AnimalShelter: should be able to deal with multiple "entry points"', async function () {
    //Reset stuff
    setup();
    // Create a validator with the profile crate
    let validator = new SossValidator(rocrateProfileCrate);
    const targetCrate = new ROCrate({ array: true, link: true });
    var results = await validator.validateCrate(targetCrate);
    targetCrate.root.name = "Test Dataset";
    targetCrate.root.license = "CC By-NC 4.0";
    targetCrate.root.datePublished = "2023-07-01";
    targetCrate.root.description = "This is an RO-Crate";
    results = await validator.validateCrate(targetCrate);
    //console.log(JSON.stringify(results, null, 2));
    expect(results.error.length).to.equal(0);

    // Now modify the Root Data Entity in the profile crate
    const rootDataEntity = rocrateProfileCrate.getEntity("#Root_Data_Entity");
    const rootDataEntity2_template = JSON.parse(JSON.stringify(rootDataEntity));
    rootDataEntity2_template["@id"] = "#Root_Data_Entity_too";
    rootDataEntity2_template['prov:specializationOf'] = [
    { '@id': 'http://schema.org/Dataset' },
    { '@id': 'http://schema.org/AnimalShelter' }
  ] ;
    rocrateProfileCrate.addEntity(rootDataEntity2_template);
    const metadataDesciptorAbout = rocrateProfileCrate.getEntity(
      "#RO-Crate_Metadata_Descriptor.about"
    );
    rocrateProfileCrate.addValues(metadataDesciptorAbout, "rangeIncludes", {
      "@id": "#Root_Data_Entity_too",
    });
    rocrateProfileCrate.addValues(rootDataEntity, "prov:specializationOf", {
      "@id": "http://schema.org/HairSalon",
    });

    // Add the new root data entity to the profile crate rules list #hasSpecializedSchema
    rocrateProfileCrate.addValues("#hasSpecializedSchema", "hasPart", {
      "@id": "#Root_Data_Entity_too",
    });
    // Now we have TWO potential signatures for the root data entity -- one that is a specialization of HairSalon and one that is a specialization of Animal Shelter
    // New validator with the modified profile crate
   
    
    validator = new SossValidator(rocrateProfileCrate);

    targetCrate.root["@type"] = ["HairSalon", "Dataset"];
    results = await validator.validateCrate(targetCrate);
    expect(results.error.length).to.equal(0);

    targetCrate.root["@type"] = ["AnimalShelter", "Dataset"];
    results = await validator.validateCrate(targetCrate);
    //console.log("AnimalShelter", JSON.stringify(results, null, 2));
    expect(results.error.length).to.equal(0);

    // Add more than the required type to the target crate
    targetCrate.root["@type"] = ["AnimalShelter", "HairSalon", "Dataset"];
    results = await validator.validateCrate(targetCrate);
    //console.log("Results:", JSON.stringify(results, null, 2));
    expect(results.error.length).to.equal(0);
  });
});
