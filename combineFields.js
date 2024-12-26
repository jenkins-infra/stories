const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

function combineFields(filePath) {
    try {
        const file = fs.readFileSync(filePath, 'utf8');
        const data = yaml.parse(file);

        let authoredBy = null;
        if (data.submitted_by) {
            authoredBy = data.submitted_by;
            delete data.submitted_by;
        } else if (data.metadata && data.metadata.combined_name_submitted_by) {
            authoredBy = data.metadata.combined_name_submitted_by;
            delete data.metadata.combined_name_submitted_by;
        }

        if (authoredBy) {
            if (!data.metadata) {
                data.metadata = {};
            }
            data.metadata.authored_by = authoredBy;

            const updatedFile = yaml.stringify(data);
            fs.writeFileSync(filePath, updatedFile, 'utf8');
        }
    } catch (error) {
        // Handle error if needed
    }
}

function updateAllYamlFiles(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directory, file);
            fs.lstat(filePath, (err, stats) => {
                if (err) {
                    return;
                }

                if (stats.isDirectory()) {
                    updateAllYamlFiles(filePath);
                } else if (file.endsWith('index.yaml')) {
                    combineFields(filePath);
                }
            });
        });
    });
}

const directory = path.join(__dirname, 'src/user-story');
updateAllYamlFiles(directory);
