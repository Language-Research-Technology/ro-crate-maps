const { describe, it, before } = require("mocha");
const { expect } = require("chai");
const path = require("path");
const fs = require("fs");
const { ROCrate } = require("ro-crate");
const { SossValidator } = require("../lib/soss-validator");

describe("Worlflow Profile Tests", function () {
  this.timeout(10000); // Allow enough time for file operations

  // Profile crate paths
  const wfProfileCratePath = path.join(
    __dirname,
    "../profiles/workflow/profile-crate/ro-crate-metadata.json"
  );

  // Sample target crate path for testing
  const sampleCratePath = path.join(
    __dirname,
    "../profiles/workflow/examples/minimal-example/ro-crate-metadata.json"
  );

  let workflowProfileCrate;
  let sampleCrate;

  // Load the crates before running tests
  before(function () {
    try {
      // Load RO-Crate profile crate
      console.log("Loading Workflow profile crate from:", wfProfileCratePath);
      const profileData = fs.readFileSync(wfProfileCratePath, "utf8");
      const profileJson = JSON.parse(profileData);
      workflowProfileCrate = new ROCrate(profileJson, {
        array: true,
        link: true,
      });

      // Load sample target crate
      const sampleCrateData = fs.readFileSync(sampleCratePath, "utf8");
      const targetJson = JSON.parse(sampleCrateData);
      sampleCrate = new ROCrate(targetJson, { array: true, link: true });
    } catch (error) {
      console.error("Error loading test crates:", error);
    }
  });
 
  it("It should be able to validate the sample workflow crate", async function () {
    const validator = new SossValidator(workflowProfileCrate);
    workflowCrateJSON = JSON.parse(fs.readFileSync(sampleCratePath, "utf8"));
    const targetCrate = new ROCrate(workflowCrateJSON,  { array: true, link: true });
    const results = await validator.validateCrate(targetCrate);
    console.log("Initial validation results:", JSON.stringify(results,null,2));
    expect(results.error.length).to.equal(0);
    })
  
  
  it("It should be able to validate a workflow crate built up piece by piece", async function () {
    // Create a validator with the profile crate
    const validator = new SossValidator(workflowProfileCrate);
    const targetCrate = new ROCrate({ array: true, link: true });

  
    console.log("Initial validation results:", JSON.stringify(results,null,2));
    results = await validator.validateCrate(targetCrate);

    expect(results.error.length).to.equal(3);
   


    targetCrate.root.name = "Test Dataset";

    results = await validator.validateCrate(targetCrate);

    console.log("Validation results after adding name:", JSON.stringify(results,null,2));
 
    expect(results.rules["#Root_Data_Entity"]["./"]["property-success"]).to.deep.include({
      message: `Property "name" validation succeeded for entity ./`
    });




    targetCrate.root.license = "CC By-NC 4.0";

   
    targetCrate.root.datePublished = "2023-07-01";

    targetCrate.root.description = "This is a test workflow dataset";


    // The _Crate_ SHOULD contain a File `README.md` at the root level. If present, it SHOULD be `about` the _Crate_ `./` and SHOULD have `text/markdown` as its `encodingFormat`.
    const readmeFile = {
      "@id": "README.md",
      "about": {"@id": "./" },
      "@type": ["File", 'CreativeWork'],
      name: "Readme file for the workflow crate",
      encodingFormat: "text/markdown",
      description: "This is a test README file for the workflow crate.",
    };
    targetCrate.addValues(targetCrate.root, "about", readmeFile);
   




    // TODO Need to work out how to add back in the type CreativeWork without triggering the rootData error
    targetCrate.addValues(targetCrate.root, "conformsTo", 
      {
    "@id": "https://w3id.org/workflowhub/workflow-ro-crate/1.0",
    "@type": ["CreativeWork", "Profile"],
    "name": "Workflow RO-Crate Profile (experimental)",
    "version": "0.4.0",
    "description": "This is a profile for RO-Crates that are used to describe workflows -- NOTE have moved the conformsTo to the ROOT Data Entity  as per RO-Crate 1.2"
    }
    );
    var results = await validator.validateCrate(targetCrate);

    console.log("Validation results after adding conformsTo:", JSON.stringify(results,null,2));


   


    
    // PROFILE TEXT:
    // The _Crate_ MUST contain a data entity of type `["File", "SoftwareSourceCode", "ComputationalWorkflow"]` as the _Main Workflow_.
    // The _Crate_ MUST refer to the _Main Workflow_ via `mainEntity`. ]
    


    const mainWorkflow = {
      "@id": "workflow.txt",
      "@type": ["File", "SoftwareSourceCode", "ComputationalWorkflow"],
      name: "Test Workflow",
      description: "This is a test workflow",
    };
    targetCrate.root.mainEntity = mainWorkflow;
    results = await validator.validateCrate(targetCrate);

  

    // "The Main Workflow MUST refer to its type via programmingLanguage.""
    // "To ensure compatibility, please include one of the following in the RO-Crate metadata, and refer to it from the Main Workflow’s programmingLanguage."
    targetCrate.addValues(mainWorkflow, "programmingLanguage", 
      {
      "@id": "https://w3id.org/workflowhub/workflow-ro-crate#nextflow",
      "@type": "ComputerLanguage",
      "name": "Nextflow",
      "identifier": {
        "@id": "https://www.nextflow.io/"
      },
      "url": {
        "@id": "https://www.nextflow.io/"
      }
    });

    results = await validator.validateCrate(targetCrate);
    



    

    // The _Crate_ COULD contain a Dataset (directory) data entity of type `["Dataset"]` with identifier `examples/` to hold examples.
     const examplesDataset = {
      "@id": "examples/",
      "@type": ["Dataset"],
      name: "Examples Dataset",
      description: "This is a test dataset for examples.",
    };
    targetCrate.pushValue(targetCrate.root, "hasPart", examplesDataset);
    results = await validator.validateCrate(targetCrate);
    console.log(JSON.stringify(results, null, 2));

    

    targetCrate.pushValue(targetCrate.root, "hasPart", readmeFile);
    results = await validator.validateCrate(targetCrate);

  


    // The _Crate_ COULD contain a Dataset (directory) data entity of type `["Dataset"]` with identifier `test/` to hold tests.
    const testDataset = {
      "@id": "test/",
      "@type": ["Dataset"],
      name: "Test Dataset",
      description: "This is a test directory in the RO-Crate for tests.",
    };
    targetCrate.pushValue(targetCrate.root, "hasPart", testDataset);
    results = await validator.validateCrate(targetCrate);   

    


    // The _Crate_ COULD contain a data entity of type `["File", "SoftwareSourceCode", "HowTo"]` as the _Main Workflow CWL Description_. 

    // A _Main Workflow CWL Description_ SHOULD have `https://w3id.org/workflowhub/workflow-ro-crate#cwl` as its `programmingLanguage` with a corresponding [contextual entity](#cwl).

    // If _Main Workflow CWL Description_ is present, the _Main Workflow_ MUST refer to it the via `subjectOf`.

    

    // ### Main Workflow Diagram

    // The _Crate_ COULD contain a _Main Workflow Diagram_, indicated as a data entity of type `["File", "ImageObject"]`.

    // If  _Main Workflow Diagram_ is present, the _Main Workflow_ MUST refer to it via `image`.




    console.log("Final results", JSON.stringify(results, null, 2));

    expect(results.error.length).to.equal(0);
  });
  
  
});
