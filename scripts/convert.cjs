const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src');
const yamlFiles = [];

function findYamlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findYamlFiles(entryPath);
    } else if (entry.isFile() && entry.name.endsWith('.yaml')) {
      yamlFiles.push(entryPath);
    }
  }
}

findYamlFiles(root);

const tokenRegex = /(\[[^\]]*\]\([^\)\n]+\)|<https?:\/\/[^>\s]+>|https?:\/\/[^\s<>"'\)\]]+)/g;
const orgLineRegex = /^(?<indent>\s*)organization\s*:\s*(?<value>.*)$/;

function extractLinkTokens(value) {
  const tokens = [];
  let match;
  while ((match = tokenRegex.exec(value)) !== null) {
    tokens.push(match[1]);
  }
  return tokens;
}

function normalizeToken(token) {
  const mdLink = token.match(/^\[[^\]]*\]\(([^\)]+)\)$/);
  if (mdLink) return mdLink[1];
  const angleLink = token.match(/^<([^>]+)>$/);
  if (angleLink) return angleLink[1];
  return token;
}

function cleanOrganization(value, tokens) {
  let cleaned = value;
  for (const token of tokens) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const tokenPattern = new RegExp(escaped);
    cleaned = cleaned.replace(tokenPattern, '');
  }
  cleaned = cleaned.replace(/\s*(,|;|\band\b|\bAND\b|\bAnd\b|\|)\s*/g, ', ');
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  cleaned = cleaned.trim();
  cleaned = cleaned.replace(/^[,;\s]+|[,;\s]+$/g, '');
  return cleaned;
}

const changedFiles = [];

for (const filePath of yamlFiles.sort()) {
  let text = fs.readFileSync(filePath, 'utf8');
  if (text.includes('company_website:')) {
    continue;
  }

  const lines = text.split(/\r?\n/);
  let updated = false;
  const newLines = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const match = orgLineRegex.exec(line);
    if (match && !updated) {
      const indent = match.groups.indent;
      let value = match.groups.value.trim();
      const hasOuterQuotes =
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"));
      if (hasOuterQuotes) {
        value = value.slice(1, -1);
      }

      const tokens = extractLinkTokens(value);
      if (tokens.length === 0) {
        newLines.push(line);
        continue;
      }

      const cleaned = cleanOrganization(value, tokens);
      const organizationValue = cleaned === '' ? value.trim() : cleaned;
      const quotedOrganization =
        organizationValue.includes(' ') || organizationValue === ''
          ? `"${organizationValue}"`
          : organizationValue;
      const websiteValue = tokens.map(normalizeToken).join(', ');

      newLines.push(`${indent}organization: ${quotedOrganization}`);
      newLines.push(`${indent}company_website: "${websiteValue}"`);
      updated = true;
    } else {
      newLines.push(line);
    }
  }

  if (updated) {
    const hasTrailingNewline = /(?:\r?\n)$/.test(text);
    const trimmedLines = newLines.at(-1) === '' ? newLines.slice(0, -1) : newLines;
    let output = trimmedLines.join('\n');
    if (hasTrailingNewline) {
      output += '\n';
    }
    fs.writeFileSync(filePath, output, 'utf8');
    changedFiles.push(filePath);
  }
}

console.log(`Updated ${changedFiles.length} YAML files.`);
changedFiles.forEach(f => console.log(f));