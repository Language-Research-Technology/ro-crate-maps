#!/usr/bin/env node
/**
 * SoSS+ Validator - Validates RO-Crates against SoSS+ profiles
 *
 * This validator follows the SoSS+ validation algorithm to check if a target crate
 * conforms to a SoSS+ profile.
 */

const fs = require("fs");
const { ref } = require("process");
const { ROCrate } = require("ro-crate");

// Helper function to create GitHub-compatible IDs
function createGitHubCompatibleId(id) {
  return id
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Base Rule class - all validation rules inherit from this
 */
class Rule {
  constructor(entity, validator) {
    this.entity = entity;
    this.validator = validator;
    this.id = entity["@id"];
    this.name = entity["name"] || entity["rdfs:label"] || this.id;
    this.description = entity["description"] || entity["rdfs:comment"] || "";
  }

  validate(...args) {
    throw new Error("validate() must be implemented by subclass");
  }

  addResult(level, message, entityId) {
    this.validator.addResult(level, message, this.id, entityId);
  }

  log(message, level = "info") {
    this.validator.log(message, level);
  }
}

/**
 * ClassRule - validates entities against class definitions
 */
class ClassRule extends Rule {
  constructor(entity, validator) {
    super(entity, validator);
    this.minCount = entity["sh:minCount"] ? parseInt(entity["sh:minCount"]) : 0;
    this.maxCount = entity["sh:maxCount"]
      ? parseInt(entity["sh:maxCount"])
      : Number.MAX_SAFE_INTEGER;
    this.resolvedTypes = this.extractResolvedTypes();
    this.propertyRules = this.findPropertyRulesForClass();
   this.log(
      `ClassRule created for ${this.id} with types: ${this.resolvedTypes}`
    );
  }

  extractResolvedTypes() {
    const types = this.entity["prov:specializationOf"] || [
      { "@id": this.entity["@id"] },
    ];
    this.log(`Extracting resolved types for class ${this.id}:`, types);
    return types.map((type) =>
      this.validator.profileCrate.resolveTerm(type["@id"])
    );
  }
  /**
   * Check if an entity has all the required types
   * @param {Object} entity - The entity to check
   * @param {Array} requiredTypes - Array of required type strings
   * @returns {boolean} True if entity has all required types
   */
  validateEntityTypes(entity) {
    const requiredTypes = this.resolvedTypes;
    if (!entity["@type"]) {
      return false;
    }
    this.log(`requiredTypes: ${requiredTypes.join(", ")}`, "debug");

    // Get the entity types and resolve them
    const rawEntityTypes = entity["@type"];
    const entityTypes = rawEntityTypes.map((type) => {
      const resolvedType = this.validator.targetCrate.resolveTerm(type);
      this.log(`Resolving entity type ${type} to ${resolvedType}`, "debug");
      return resolvedType;
    });

    this.log(`entityTypes: ${entityTypes.join(", ")}`, "debug");
    // Check if all required types are present in the resolved entity types
    return requiredTypes.every((type) => {
      this.log(`Checking if entity has required type: ${type} - ${entityTypes.includes(type)}`, "debug");
      return entityTypes.includes(type);
    });
  }

  validate(targetCrate) {
    this.log(`Processing class rule: ${this.id}`, "info");
    if (this.resolvedTypes.length === 0) {
      this.log(
        `Class rule ${this.id} does not specify any types via prov:specializationOf`,
        "warn"
      );
      this.addResult(
        "warning",
        `Class rule ${this.id} does not specify any types via prov:specializationOf`,
        "..."
      );
      return false;
    }

    // Count how many entities in the target crate match these types
    let classMatches = 0;
    this.log(
      `Looking for entities with types: ${this.resolvedTypes.join(", ")}`,
      "debug"
    );

    // For each entity in the target crate, validate against the types
    for (const entity of targetCrate.entities()) {
      const entityId = entity["@id"];
      const entityTypes = entity["@type"];

      this.log(
        `Examining entity: ${entityId} with types: ${entityTypes.join(", ")}`,
        "debug"
      );

     
        const entityValid = this.validator.validateEntity(entity, this);
        if (entityValid === true) {
          classMatches++;
          this.log(
            `Entity ${entityId} is valid for class rule ${this.name}`,
            "info"
          );
        } else if (entityValid === false) {
          this.log(
            `Entity ${entityId} failed validation for class rule ${this.name}`,
            "warn"
          );
        }
      
    }

    return this.validateCardinality(classMatches);
  }

  validateCardinality(matchCount) {
    this.log(
      `Found ${matchCount} matches for class rule ${this.name} (min: ${
        this.minCount
      }, max: ${this.maxCount || "unlimited"})`,
      "info"
    );

    if (matchCount < this.minCount) {
      this.log(
        `Expected at least ${this.minCount} instances of ${
          this.name
        } : ${this.resolvedTypes.join(", ")}, found ${matchCount}`,
        "error"
      );
      this.addResult(
        "error",
        `Expected at least ${this.minCount} instances of ${
          this.name
        } : ${this.resolvedTypes.join(", ")}, found ${matchCount}`,
        "..."
      );
      return false;
    } else if (matchCount > this.maxCount) {
      this.log(
        `Expected at most ${
          this.maxCount
        } instances of ${this.resolvedTypes.join(", ")}, found ${matchCount}`,
        "error"
      );
      this.addResult(
        "error",
        `Expected at most ${
          this.maxCount
        } instances of ${this.resolvedTypes.join(", ")}, found ${matchCount}`
      );
      return false;
    } else {
      this.log(
        `Found ${matchCount} valid instances of ${this.resolvedTypes.join(
          ", "
        )} (expected between ${this.minCount} and ${this.maxCount})`,
        "info"
      );
      this.addResult(
        "success",
        `Found ${matchCount} valid instances of ${this.resolvedTypes.join(
          ", "
        )} (expected between ${this.minCount} and ${this.maxCount})`,
        "..."
      );
      return true;
    }
  }

  findPropertyRulesForClass() {
    // Check if there are @reverse domainIncludes references
    // Returns a list of RO-Crate entities - not actually rules
    if (
      this.entity &&
      this.entity["@reverse"] &&
      this.entity["@reverse"]["domainIncludes"]
    ) {
      return this.entity["@reverse"]["domainIncludes"];
    }
    return [];
  }
}

/**
 * PropertyRule - validates property constraints
 */
class PropertyRule extends Rule {
  constructor(entity, validator) {
    super(entity, validator);
    this.propertyName = entity["rdfs:label"] || entity["name"];
    this.minCount = entity["sh:minCount"] ? parseInt(entity["sh:minCount"]) : 0;
    this.maxCount = entity["sh:maxCount"]
      ? parseInt(entity["sh:maxCount"])
      : Number.MAX_SAFE_INTEGER;
    this.rangeIncludes =
      entity["rangeIncludes"] ||
      entity["http://schema.org/rangeIncludes"] ||
      [];
    this.fixedValue = entity["value"];
    this.allRules = validator.rules;
    // If this property is describing the ro-crate-metadata ID then it's special
    if (entity?.["rdfs:label"]?.[0] === "@id" && entity?.["value"]?.[0] === "ro-crate-metadata.json") {
      this.log(`Property rule ${this.id} is describing the ro-crate-metadata ID ${entity?.domainIncludes[0]["@id"]}`);
      this.validator.rules.__rootRuleId = entity?.domainIncludes?.[0]?.["@id"];
    }
  }

  validate(entity) {
    if (!this.propertyName) {
      this.log(`Property rule ${this.id} does not have a name`, "warn");
      this.addResult(
        "warning",
        `Property rule ${this.id} does not have a name`,
        entity["@id"]
      );
      return false;
    }
    const entityId = entity["@id"];
    let propertyValues = entity[this.propertyName];
    // Cast propertyValues to an array if it's not already
    if (propertyValues && !Array.isArray(propertyValues)) {
      propertyValues = [propertyValues];
    }
    this.log(
      `Validating property ${this.propertyName} with values ${JSON.stringify(
        propertyValues
      )} for entity ${entityId}`,
      "debug"
    );
    // Check if property has a fixed value defined by schema:value
    if (this.fixedValue) {
      return this.validateFixedValue(entity, propertyValues);
    }

    return this.validatePropertyConstraints(entity, propertyValues);
  }

  validateFixedValue(entity, propertyValues) {
    const entityId = entity["@id"];
    const expectedValue = this.fixedValue;

    // If the property doesn't exist and it's required
    if (!propertyValues && this.minCount > 0) {
      this.log(
        `Entity ${entityId} is missing required property ${this.propertyName} with fixed value ${expectedValue}`,
        "error"
      );
      this.addResult(
        "error",
        `Entity ${entityId} is missing required property ${this.propertyName} with fixed value ${expectedValue}`,
        entity["@id"]
      );
      return false;
    }

    // If property exists, check if any of its values match the expected value
    if (propertyValues) {
      let matches = true;
      let i = 0;
      for (const value of propertyValues) {
        this.log(
          `Checking value ${JSON.stringify(
            value
          )} against expected fixed value ${expectedValue[i]}`,
          "debug"
        );
        if (value === expectedValue[i] && matches === true) {
          this.log(
            `Entity ${entityId} property ${this.propertyName} matches expected fixed value ${expectedValue[i]}`,
            "debug"
          );
        } else {
          this.log(
            `Entity ${entityId} property ${this.propertyName} does not match expected fixed value ${expectedValue[i]}`,
            "error"
          );
          matches = false;
        }
        i += 1;
      }

      if (!matches) {
        this.log(
          `Entity ${entityId} property ${this.propertyName} values do not match expected fixed value ${expectedValue}`,
          "error"
        );
        this.addResult(
          "info",
          `Entity ${entityId} property ${this.propertyName} values do not match expected fixed value ${expectedValue}`,
          entity["@id"]
        );
        return false;
      }

      this.log(
        `Entity ${entityId} property ${this.propertyName} matches fixed value ${expectedValue}`,
        "debug"
      );
      return true;
    }

    return true;
  }

  


  validatePropertyConstraints(entity, propertyValues) {
    const entityId = entity["@id"];

    // Check if required property is missing
    if (!propertyValues && this.minCount > 0) {
      this.log(
        `Entity ${entityId} is missing required property ${this.propertyName}`,
        "error"
      );
      this.addResult(
        "info",
        `Entity ${entityId} is missing required property ${this.propertyName}`,
        entity["@id"]
      );
      return false;
    }

    // If property doesn't exist but is not required, it's valid
    if (!propertyValues || propertyValues.length === 0) {
      this.log(
        `Property ${this.propertyName} not present in entity ${entityId} but not required`,
        "debug"
      );
      return true;
    }

    this.log(
      `Property ${this.propertyName} has ${propertyValues.length} values in entity ${entityId}`,
      "debug"
    );

    // Check min and max count constraints
    this.log(
      `Property ${this.propertyName} constraints: min=${this.minCount}, max=${
        this.maxCount || "unlimited"
      }`,
      "debug"
    );

    if (propertyValues.length < this.minCount) {
      this.log(
        `Entity ${entityId} has ${propertyValues.length} values for property ${this.propertyName}, but at least ${this.minCount} are required`,
        "error"
      );
      this.addResult(
        "info",
        `Entity ${entityId} has ${propertyValues.length} values for property ${this.propertyName}, but at least ${this.minCount} are required`,
        entity["@id"]
      );
      return false;
    }

    if (propertyValues.length > this.maxCount) {
      this.log(
        `Entity ${entityId} has ${propertyValues.length} values for property ${this.propertyName}, but at most ${this.maxCount} are allowed`,
        "error"
      );
      this.addResult(
        "error",
        `Entity ${entityId} has ${propertyValues.length} values for property ${this.propertyName}, but at most ${this.maxCount} are allowed`
      );
      return false;
    }

    // Check the range constraints
    if (!this.rangeIncludes || this.rangeIncludes.length === 0) {
      this.log(
        `No range constraints for property ${this.propertyName}`,
        "debug"
      );
      return true;
    }

    // Check each value against the range constraints
    for (const value of propertyValues) {
      this.log(
        `Validating value ${JSON.stringify(value)} against range constraints`,
        "debug"
      );
      if (!this.validator.validatePropertyValue(value, this.rangeIncludes)) {
        this.log(
          `Entity ${entityId} has an invalid value for property ${
            this.propertyName
          }: ${JSON.stringify(value)}`,
          "error"
        );
        this.addResult(
          "info",
          `Entity ${entityId} has an invalid value for property ${this.propertyName}`,
          entity["@id"]
        );
        return false;
      }
    }

    this.log(
      `Property ${this.propertyName} in entity ${entityId} is valid`,
      "debug"
    );
    return true;
  }
}

/**
 * ItemListRule - validates against enumerated lists
 */
class ItemListRule extends Rule {
  constructor(entity, validator) {
    super(entity, validator);
    this.itemListElements = entity["itemListElement"] || [];
  }

  validate(value) {
    for (const item of this.itemListElements) {
      if (this.matchesItem(value, item)) {
        this.log(
          `Value ${value["@id"]} matches an @id in item list ${this.id}`,
          "debug"
        );
        return true;
      }
    }

    this.log(
      `Value ${value["@id"]} does not match any @id in item list ${this.id}`,
      "debug"
    );
    return false;
  }

  matchesItem(value, item) {
    // Compare IDs properly
    if (item["@id"] === value["@id"]) {
      // Iterate through all properties of the item except @id
      for (const prop in item) {
        if (prop === "@id") continue;

        const actualValues = value[prop];

        // If property is missing entirely when required
        if (!actualValues || actualValues.length === 0) {
          this.log(
            `Value ${value["@id"]} is missing expected property ${prop}`,
            "error"
          );
          return false;
        }

        const expectedValues = item[prop];

        // Check each expected value
        for (const expectedVal of expectedValues) {
          let found = false;

          for (const actVal of actualValues) {
            // Handle objects with @id
            if (
              typeof expectedVal === "object" &&
              expectedVal["@id"] &&
              typeof actVal === "object" &&
              actVal["@id"]
            ) {
              if (expectedVal["@id"] === actVal["@id"]) {
                found = true;
                break;
              }
            }
            // Handle string/primitive values
            else if (expectedVal === actVal) {
              found = true;
              break;
            }
          }

          if (!found) {
            const expectedDisplay =
              typeof expectedVal === "object"
                ? JSON.stringify(expectedVal)
                : expectedVal;

            this.log(
              `Value for property ${prop} does not match expected value: ${expectedDisplay}`,
              "error"
            );
            return false;
          }
        }
      }

      this.log(
        `Value ${value["@id"]} matches item list ${this.id}`,
        "debug"
      );
      return true;
    }
    return false;
  }
}

/**
 * TermRule - validates defined term sets
 */
class TermRule extends Rule {
  constructor(entity, validator) {
    super(entity, validator);
    this.termSet = entity;
  }

  validate(targetCrate) {
    // Term validation logic would go here
    // For now, just return true as terms are primarily for documentation
    return true;
  }
}

class SossValidator {
  constructor(profileCratePathOrObject) {
    this.profileCrate = null;
    this.profileCratePath = null;
    this.clearResults();
    // Keep track of entities we've already validated to avoid circular validation
    this.validatedEntities = {}; // Will hold the validated entities and the rules they have been tested against already
    this.rulesDone = new Set();

    // Configure logging level - can be set to false to disable or true for verbose
    this.verbose = false;

    // Rule collections
    this.rules = {
      classes: [],
      properties: [],
      itemLists: [],
      termSets: [],
    };

    // Handle both path string or direct ROCrate object
    if (typeof profileCratePathOrObject === "string") {
      this.profileCratePath = profileCratePathOrObject;
    } else if (profileCratePathOrObject instanceof ROCrate) {
      this.profileCrate = profileCratePathOrObject;
      this.log("SoSS+ profile loaded from provided object");
    } else {
      throw new Error(
        "Profile must be a path to a crate file or an ROCrate object"
      );
    }
    // Default target crate to profile crate so we can validate the profile itself
    this.targetCrate = this.profileCrate;
  }

  clearResults() {
    this.results = {
      error: [],
      success: [],
      rules: {},
    };
  }

  /**
   * Helper method for logging with different verbosity levels
   * @param {string} message - Message to log
   * @param {string} level - Log level (debug, info, warn, error)
   */
  log(message, level = "info") {
    if (!this.verbose) return;

    const prefix =
      level === "debug"
        ? "🔍 DEBUG:"
        : level === "info"
        ? "📋 INFO:"
        : level === "warn"
        ? "⚠️ WARNING:"
        : level === "error"
        ? "❌ ERROR:"
        : "";

    this.log(`${prefix} ${message}`);
  }

  /**
   * Load the SoSS+ profile crate from path if not already loaded
   */
  loadProfileCrate() {
    // If already loaded, return true
    if (this.profileCrate) {
      return true;
    }

    try {
      this.log(`Loading SoSS+ profile from: ${this.profileCratePath}`);
      const crateData = fs.readFileSync(this.profileCratePath, "utf8");
      const crateJson = JSON.parse(crateData);
      this.profileCrate = new ROCrate(crateJson, { array: true, link: true });
      this.log("SoSS+ profile loaded successfully");
      return true;
    } catch (error) {
      console.error(`Error loading SoSS+ profile: ${error.message}`);
      return false;
    }
  }

  /**
   * Parse profile crate entities into Rule objects
   */
  parseRules() {
    this.rules = {
      classes: {},
      properties: {},
      itemLists: {},
      termSets: {},
    };
    
    const schemaEntities = () => {
      for (let entity of this.profileCrate.root.hasResource || []) {
        if (entity["@type"].includes("ResourceDescriptor") && entity["hasRole"]?.some(
        (role) => role["@id"] === "http://www.w3.org/ns/dx/prof/role/schema")) {

          return entity["hasPart"] || [];
        }
      }
      return []; // Add fallback return
    };
    
    // Call the function to get the schema entities
    const entities = schemaEntities();
    console.log(`Parsing ${entities.length} schema entities from profile crate`);
    
    
    for (let entity of entities) {
      const types = entity["@type"] || [];

      if (types.includes("rdfs:Class")) {
        const classRule = new ClassRule(entity, this);
        this.rules.classes[classRule.id] = classRule;
      } else if (types.includes("rdf:Property")) {
        const propertyRule = new PropertyRule(entity, this);
        this.rules.properties[propertyRule.id] = propertyRule;
      } else if (types.includes("ItemList")) {
        const itemListRule = new ItemListRule(entity, this);
        this.rules.itemLists[itemListRule.id] = itemListRule;
      } else if (types.includes("DefinedTermSet")) {
        const definedTermSetRule = new TermRule(entity, this);
        this.rules.termSets[definedTermSetRule.id] = definedTermSetRule;
      }
    }
    
    // Now link property rules to their corresponding class rules
    
    for (let classRule of Object.values(this.rules.classes)) {
      classRule.propertyRules = classRule.findPropertyRulesForClass().map(pr => {
        // Find the corresponding PropertyRule object
       return this.rules.properties[pr["@id"]] || null;
      });  
    }
    
    this.rules.rootClassRule = this.rules.classes[this.rules.__rootRuleId] || null;

    console.log(
      `Found ${
        Object.keys(this.rules.classes).length
      } class rules in the SoSS+ profile`
    );
    console.log(
      `Found ${
        Object.keys(this.rules.properties).length
      } property rules in the SoSS+ profile`
    );
    console.log(
      `Found ${
        Object.keys(this.rules.itemLists).length
      } item list rules in the SoSS+ profile`
    );
    console.log(
      `Found ${
        Object.keys(this.rules.termSets).length
      } term set rules in the SoSS+ profile`
    );
  }


  /**
   * Validate a target crate against the SoSS+ profile
   * @param {ROCrate|string} targetCrate - The target crate object or path to validate
   */
  async validateCrate(targetCrate) {
    this.targetCrate = targetCrate;
    await this.targetCrate.resolveContext();
    try {
      let crate;
      // Handle different input types
      if (typeof targetCrate === "string") {
        // If a string is provided, treat as a file path
        this.log(`Loading target crate from path: ${targetCrate}`);
        const targetData = fs.readFileSync(targetCrate, "utf8");
        const targetJson = JSON.parse(targetData);
        crate = new ROCrate(targetJson, { array: true, link: true });
        this.log("Target crate loaded successfully from path");
      } else if (targetCrate instanceof ROCrate) {
        // If an ROCrate object is provided, use it directly
        crate = targetCrate;
        this.log("Using provided target crate object");
      } else {
        throw new Error("Target crate must be a path or an ROCrate object");
      }

      // Ensure the profile crate is loaded
      if (!this.profileCrate && !this.loadProfileCrate()) {
        throw new Error("Failed to load profile crate");
      }

      // Reset validation state
      this.validatedEntities = {};
      this.rulesDone.clear();
      this.clearResults();

      // Parse rules from profile crate
      this.parseRules();

      // Validate the target crate against the SoSS+ profile
      this.validateTargetCrateGraph(crate);

      return this.results;
    } catch (error) {
      console.error(`Validation error: ${error.message}`);
      this.addResult(
        "error",
        `Validation failed: ${error.message}`,
        "exception"
      );
      return this.results;
    }
  }

  /**
   * Validate the target crate graph against the SoSS+ profile using Rule objects
   */
  validateTargetCrateGraph(targetCrate) {
    // Process all class rules
    for (const classRule of Object.values(this.rules.classes)) {
      classRule.validate(targetCrate);
    }
  }

  /**
   * Extract types from specializationOf property
   * @param {Object|Array|string} specializationOf - The specializationOf property value
   * @returns {Array} Array of type strings
   */
  extractTypes(specializationOf) {
    if (!specializationOf) {
      return [];
    }

    if (Array.isArray(specializationOf)) {
      return specializationOf.map((s) =>
        typeof s === "object" ? s["@id"] : s
      );
    } else if (typeof specializationOf === "object") {
      return [specializationOf["@id"]];
    } else {
      return [specializationOf];
    }
  }

  
  /**
   * Validate an entity against a class rule
   * @param {Object} entity - The entity to validate
   * @param {ClassRule} classRule - The class rule to validate against
   * @returns {boolean} True if validation passes
   */
  validateEntity(entity, classRule) {
    const entityId = entity["@id"];
    

    console.log(`Validating entity: ${entityId}`);

    // Check if this entity has already been validated against this class rule
    this.log(
      `Checking if entity ${entityId} has already been validated against class rule ${classRule.id} -- ${this.validatedEntities[entityId]}`,
      "debug"
    );
    if (
      this.validatedEntities[entityId] &&
      classRule.id in this.validatedEntities[entityId]
    ) {
      this.log(
        `Entity ${entityId} has ***** ALREADY ******* been validated against class rule ${classRule.id}`,
        "debug"
      );
      return this.validatedEntities[entityId][classRule.id];
    } else {
      this.validatedEntities[entityId] = this.validatedEntities[entityId] || {};
    }

    let isValid = true;

    console.log(
      `Checking class rule: ${classRule.name} for entity ${entityId} -types ${entity["@type"].join(", ")} with required types: ${classRule.resolvedTypes.join(", ")}`,
      "debug"
    );

    if (classRule.validateEntityTypes(entity)) {
      console.log(
        `Entity ${entityId} matches required types ${classRule.resolvedTypes.join(
          ", "
        )} for rule ${classRule.name}`
      );
    } else {
      this.log(
        `Entity ${entityId} does not match required types`
      )
      return false;
    }

    // Check for properties that reference this class via rangeIncludes
    const propertyRules = classRule.findPropertyRulesForClass();
    this.log(
      `Found ${propertyRules.length} property rules for class ${classRule.name}`,
      "debug"
    );

    for (const propertyRuleEntity of propertyRules) {
      const propertyRule = new PropertyRule(propertyRuleEntity, this);
      const propName = propertyRule.name;

      this.log(
        `Validating property rule: ${propName} for entity ${entityId}`,
        "debug"
      );

      // Validate each property rule against this entity
      if (!propertyRule.validate(entity)) {
        isValid = false;

        classRule.addResult(
          "property-errors",
          `Property "${propName}" validation failed for entity ${entityId}`,
          entity["@id"]
        );
      } else {
        classRule.addResult(
          "property-success",
          `Property "${propName}" validation succeeded for entity ${entityId}`,
          entity["@id"]
        );
      }
    }

    this.log(
      `Entity ${entityId} validation result: ${isValid ? "valid" : "invalid"}`,
      "info"
    );
    this.validatedEntities[entityId][classRule.id] = isValid;

    return isValid;
  }

  // Function to look through all the class rules and see if one matches this entity


  /**
   * Validate a property value against range constraints
   * @param {any} value - The property value to validate
   * @param {Array} rangeArray - Array of range constraint entities
   * @returns {boolean} True if validation passes
   */
  validatePropertyValue(value, rangeArray) {
    // If value is an object with @id, it's a reference to another entity
    // Validate the value (from the target crate) against the range constraints
    for (const range of rangeArray)  {
      this.log(`Checking range constraint: ${JSON.stringify(range)}`, "debug");
      // Check if range if the thing we are referencing is an object with @id
      if (typeof value === "object" && value["@id"]) {
        const referencedClassRule = this.rules.classes[range["@id"]];
        const referencedItemListRule = this.rules.itemLists[range["@id"]];

        const referencedEntity = this.targetCrate.getEntity(value["@id"]);
        if (referencedEntity) {
            if (referencedClassRule) {
              this.log(
                `Found referenced entity ${value["@id"]} in target crate`,
                "debug"
              );
              // Validate the referenced entity against the range --
              // need to look up if there is a class rule for it
                this.log(
                  `Validating referenced entity ${value["@id"]} against class rules`,
                  "debug"
                );
                if  (this.validateEntity(referencedEntity, referencedClassRule)) {return true};
              }
          else if (referencedItemListRule) {
            this.log(
              `Validating referenced entity ${value["@id"]} against item list using rule ${referencedItemListRule.id}`,
              "debug"
            );
            if (referencedItemListRule.validate(value)) {return true};
          } else {
            this.log(
              `No class rules found for referenced entity ${value["@id"]}`,
              "warn"
            );
          }
        }
        }
       else {
        // Handle primitive type checks
        const rangeId = this.targetCrate.resolveTerm(
          typeof range === "object" ? range["@id"] : range
        );
        const valueType = typeof value;
        if (rangeId === "http://schema.org/Text" && valueType === "string") {
          this.log(
            `Value ${value} is valid as http://schema.org/Text`,
            "debug"
          );
          return true;
        } else if (
          rangeId === "http://schema.org/Number" &&
          (valueType === "number" || !isNaN(Number(value)))
        ) {
          this.log(
            `Value ${value} is valid as http://schema.org/Number`,
            "debug"
          );
          return true;
        } else if (
          rangeId === "http://schema.org/Boolean" &&
          valueType === "boolean"
        ) {
          this.log(
            `Value ${value} is valid as http://schema.org/Boolean`,
            "debug"
          );
          return true;
        } else if (
          rangeId === "http://schema.org/Date" &&
          this.isValidDate(value)
        ) {
          this.log(
            `Value ${value} is valid as http://schema.org/Date`,
            "debug"
          );
          return true;
        }
      }
    }
   this.log(`Value ${JSON.stringify(value)} did not match any range constraints`, "debug");
   return false;
  }

  /**
   * Check if a string is a valid date
   * @param {string} dateString - The date string to check
   * @returns {boolean} True if string is a valid date
   */
  isValidDate(dateString) {
    if (typeof dateString !== "string") {
      return false;
    }

    // Check for ISO 8601 date format
    // This is a simple check, can be made more robust
    return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/.test(
      dateString
    );
  }

  /**
   * Add a validation result
   * @param {string} level - 'error', 'success', 'warning', or 'info'
   * @param {string} message - The validation message
   */
  addResult(level, message, ruleId, entityId) {
    if (level === "error") {
      this.results["error"].push({
        message: message,
        rule: ruleId,
        entity: entityId,
      });
    } else if (level === "success") {
      this.results["success"].push({
        message: message,
        rule: ruleId,
      });
    } else {
      entityId = entityId || "...";
      if (!this.results.rules[ruleId]) {
        this.results.rules[ruleId] = {};
      }
      this.results.rules[ruleId][entityId] =
        this.results.rules[ruleId][entityId] || {};
      this.results.rules[ruleId][entityId][level] =
        this.results.rules[ruleId][entityId][level] || [];
      this.results.rules[ruleId][entityId][level].push({
        message: message,
      });
    }
  }
}

// Export the validator and rule classes
module.exports = {
  SossValidator,
  Rule,
  ClassRule,
  PropertyRule,
  ItemListRule,
  TermRule
};

// If run directly from command line
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error(
      "Usage: node soss-validator.js <profile-crate-path> <target-crate-path>"
    );
    process.exit(1);
  }

  const profilePath = args[0];
  const targetPath = args[1];

  const validator = new SossValidator(profilePath);
  if (validator.loadProfileCrate()) {
    validator
      .validateCrate(targetPath)
      .then((results) => {
        this.log("\nValidation complete.");
        if (results.error.length > 0) {
          this.log(`\nErrors (${results.error.length}):`);
          results.error.forEach((err) => this.log(`- ${err.message}`));
        }
        if (results.success.length > 0) {
          this.log(`\nSuccess (${results.success.length}):`);
          results.success.forEach((success) =>
            this.log(`- ${success.message}`)
          );
        }
      })
      .catch((error) => {
        console.error("Validation failed:", error);
        process.exit(1);
      });
  } else {
    console.error("Failed to load profile crate.");
    process.exit(1);
  }
}
