import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { load } from 'js-yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from './schema.js';
import process from 'process';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

function getYamlFiles(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getYamlFiles(fullPath));
    } else if (entry.name.endsWith('.yaml')) {
      files.push(fullPath);
    }
  }
  return files;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const files = getYamlFiles(path.resolve(__dirname, '../../src/user-story'));
let failed = 0;

for (const file of files) {
  const doc = load(fs.readFileSync(file, 'utf8'));

  if (doc.date instanceof Date) {
    doc.date = doc.date.toISOString();
  }

  const valid = validate(doc);

  if (!valid) {
    console.log(`\n ${file}`);
    for (const err of validate.errors) {
      if (err.keyword === 'additionalProperties') {
        console.log(
          `  Unknown field: "${err.instancePath}/${err.params.additionalProperty}"`,
        );
      } else {
        console.log(`  ${err.instancePath || '/'} ${err.message}`);
      }
    }
    failed++;
  }
}

console.log(`\n${files.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
