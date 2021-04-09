const fs = require('fs');

const bannerName = process.argv[2];
const bannerID = process.argv[3];

// All paths
const paths = {
    json: {
        src: 'source/data/' + bannerName + '.json',
        dest: 'source/' + bannerName + '/' + bannerName + '.json'
    }
};

/**
 * Initiate function
 */
function main() {
    var data = getUpdate(paths.json.src, bannerID);
    setUpdate(paths.json.dest, data);
}

/**
 * Get updated data
 * @param {String} filename The file to read the raw data from
 * @param {String} id The unique identifier of the banner item, first column on Google Sheet
 * @return {Object} Returns the json object matching the given id
 */
function getUpdate(filename, id) {
    var data = JSON.parse(fs.readFileSync(filename));
    console.log(data.items[id]);
    return data.items[id];
}

/**
 * Set updated data
 * @param {String} filename The file to be written
 * @param {Object} data JSON data to be written
 */
function setUpdate(filename, data) {
    console.log(data);
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

main();