const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const folderPath = path.join(__dirname, 'src/user-story');

const convertToGeoJSON = (latitude, longitude) => {
    return {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };
};

function readFilesRecursively(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            readFilesRecursively(filePath);
        } else if (file.endsWith('index.yaml')) {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const data = yaml.load(fileContents);
            
            if (data.map && data.map.latitude && data.map.longitude) {
                const latitude = data.map.latitude;
                const longitude = data.map.longitude;
                
                const geoJSON = convertToGeoJSON(latitude, longitude);
                
                const geoJSONFilePath = path.join(dir, `${path.basename(file, '.yaml')}_geojson.json`);
                fs.writeFileSync(geoJSONFilePath, JSON.stringify(geoJSON, null, 2));
            }
        }
    });
}

readFilesRecursively(folderPath);
