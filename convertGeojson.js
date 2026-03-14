const fs = require("fs");
const path = require("path");

const baseDir = "./src/user-story";

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  const regex = /geojson:\s*'\{"type":"Point","coordinates":\[(.*?),(.*?)\]\}'/;

  const match = content.match(regex);

  if (match) {
    const lng = match[1].trim();
    const lat = match[2].trim();

    const replacement = `coordinates: [${lng}, ${lat}]`;

    content = content.replace(regex, replacement);

    fs.writeFileSync(filePath, content);
    console.log("Updated:", filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file === "index.yaml") {
      processFile(fullPath);
    }
  });
}

walk(baseDir);