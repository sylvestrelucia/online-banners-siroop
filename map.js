const config = require('./config.json');
const fs = require('fs');
const readline = require('readline');

const paths = {
    json: {
        src: '.tmp/data/',
        dest: 'source/data/'
    }
};

/**
 * initiate the mapping
 */
function main() {
    for (var i = 0; i < config.sheets.tabs.length; i++) {
        var name = config.sheets.tabs[i];
        var filename = paths.json.src + name + '.json';
        //console.log(filename);
        var token = fs.readFileSync(filename);
        var data = JSON.parse(token);
        console.log(data);

        var mappedData = mapData(data);
        storeData(mappedData, name);
    }
}

/**
 *
 * @param {Object} data Raw data from the Google Sheet API
 * @return {Object} the formatted data for banner creation
 */
function mapData(data) {

    // init Object
    var obj = {
        items:  []
    };

    // mapping structure for one banner item
    var item = {
        data: {
            desc: '',
            brand: '',
            legal: {
                first: '',
                second: ''
            },
            cta: {
                text: ''
            },
            product: {
                badge: '',
                color: '',
                image: {
                    thumbnail: "50x50.jpg",
                    small: "100x100.jpg",
                    medium: "200x200.jpg",
                    large: "400x400.jpg",
                    larger: "800x800.jpg"
                }
            },
            naming: {
                category: '',
                content_type: '',
                additional: ''

            },
            price: {
                striked: '',
                reduced: ''
            },
            date: ''
        }
    };

    obj.items = {};

    //loop the array to map each Google Sheet Row
    for (var i=0, len=data.length; i<len; i++) {
        var key = data[i][0];
        obj.items[key] = JSON.parse(JSON.stringify(item));
        obj.items[key].data.product.badge = data[i][1];
        obj.items[key].data.product.color = data[i][2];
        obj.items[key].data.desc = data[i][3];
        obj.items[key].data.brand = data[i][4];
        obj.items[key].data.cta.text = data[i][5];
        obj.items[key].data.legal.first = data[i][6];
        obj.items[key].data.legal.second = data[i][7];
        obj.items[key].data.naming.category = data[i][8];
        obj.items[key].data.naming.content_type = data[i][9];
        obj.items[key].data.naming.additional = data[i][10];
        obj.items[key].data.price.striked = data[i][11];
        obj.items[key].data.price.reduced = data[i][12];
        obj.items[key].data.date = data[i][13];
    }

    return obj;
}

/**
 * Store JSON data in the given filename
 *
 * @param data
 */
function storeData(data, name) {
    try {
        fs.mkdirSync(paths.json.dest);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
    fs.writeFileSync(paths.json.dest + name + '.json', JSON.stringify(data, null, 2));
    console.log('Token stored to ' + paths.json.dest + name);
}

main();
