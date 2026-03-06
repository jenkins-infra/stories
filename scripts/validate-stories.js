const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const Ajv = require('ajv');

const storySchema = {
    type: 'object',
    required: ['body_content'],
    properties: {
        title: {type: 'string'},
        authored_by: {type: 'string'},
        post_name: {type: 'string'},
        tag_line: {type: 'string'},
        body_content: {
            type: 'object',
            required: ['paragraphs'],
            properties: {
                title: {type: ['string', 'null']},
                paragraphs: {
                    type: 'array',
                    minItems: 1,
                    items: {type: 'string'},
                },
            },
        },
    },
};

const ajv = new Ajv({allErrors: true, strictTypes: false});
const validate = ajv.compile(storySchema);

const storiesDir = path.resolve(__dirname, '..', 'src', 'user-story');
const dirs = fs.readdirSync(storiesDir, {withFileTypes: true}).filter(d => d.isDirectory());

let failed = false;

for (const dir of dirs) {
    const filePath = path.join(storiesDir, dir.name, 'index.yaml');

    if (!fs.existsSync(filePath)) {
        continue;
    }

    let parsed;
    try {
        parsed = YAML.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
        console.error(`${dir.name}/index.yaml: could not parse YAML — ${err.message}`);
        failed = true;
        continue;
    }

    if (!validate(parsed)) {
        console.error(`${dir.name}/index.yaml:`);
        for (const e of validate.errors) {
            console.error(`  ${e.instancePath || '/'} ${e.message}`);
        }
        failed = true;
    }
}

if (failed) {
    process.exit(1);
}

console.log(`Validated ${dirs.length} stories — all good.`);
