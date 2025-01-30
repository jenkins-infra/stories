const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const folderPath = path.join(__dirname, 'src/user-story');

const convertToGeoJSONString = (latitude, longitude) => {
    const geoJSON = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };
    return JSON.stringify(geoJSON);
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

                data.map.geojson = convertToGeoJSONString(latitude, longitude);

                delete data.map.latitude;
                delete data.map.longitude;

                fs.writeFileSync(filePath, yaml.dump(data, {lineWidth: -1}));
            }
        }
    });
}

readFilesRecursively(folderPath);
