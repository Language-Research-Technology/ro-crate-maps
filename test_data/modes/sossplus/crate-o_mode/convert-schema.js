#!/usr/bin/env node
/**
 * One-off script to convert the schema.json mode file to an RO-Crate with SoSS+ profile
 */

const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

// Define paths
const modeFilePath = path.join(__dirname, 'schema.json');
const outputPath = path.join(__dirname, '..', '..', '..', '..', 'profiles', 'sossplus', 'profile-crate');
const converterPath = path.join(__dirname, '..', '..', '..', '..', 'mode-to-sossplus.js');

// Ensure output directory exists
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
  console.log(`Created output directory: ${outputPath}`);
}

console.log('Converting mode file to SoSS+ profile RO-Crate');
console.log(`Mode file: ${modeFilePath}`);
console.log(`Output directory: ${outputPath}`);
console.log(`Converter script: ${converterPath}`);

try {
  // Run the mode-to-sossplus.js script
  const command = `node ${converterPath} -m ${modeFilePath} -o ${outputPath} -n "https://schema.org/"`;
  console.log(`Running command: ${command}`);
  
  const output = execSync(command, { encoding: 'utf8' });
  console.log(output);
  
  console.log('Conversion completed successfully!');
  console.log(`RO-Crate with SoSS+ profile created in: ${outputPath}`);
} catch (error) {
  console.error('Error during conversion:');
  console.error(error.message);
  process.exit(1);
}