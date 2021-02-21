const fs = require('fs');
const crypto = require('crypto');
const exifr = require('exifr');
const piexif = require('piexifjs');

const fileSmallJpg = 'D:\\LukasRuegner\\Bilder\\2019 Niederlande - BestOf\\LRM_EXPORT_757291498367834_20190812_144048700.jpeg';
const fileMartin = 'C:\\Users\\LukasRuegner\\Desktop\\testlibrary\\1803d0001.tif';


async function main() {
    const data1 = await getImageData(fileMartin);
    console.log(JSON.stringify(data1));

    write(fileMartin, 'C:\\Users\\LukasRuegner\\Desktop\\testlibrary\\1803d0001_b.tif');
    console.log('=================');

    const data2 = await getImageData('C:\\Users\\LukasRuegner\\Desktop\\testlibrary\\1803d0001_b.tif');
    console.log(JSON.stringify(data2));
}


main().then(function() {
});


async function getImageData(filepath) {
    const hash = await computeHash(fileMartin, 'md5');

    let output = await exifr.parse(filepath, {
        xmp: true,
        icc: true,
        ipct: true,
        makerNote: true,
        skip: ['PhotoshopSettings'],
    });
    console.log(JSON.stringify(output, null, 4));

    return {
        filepath: filepath,
        hash: hash,
    };
}


function computeHash(filepath, algorithm) {
    return new Promise((resolve, reject) => {
        console.log('start computing hash: ' + filepath);
        let hash = crypto.createHash(algorithm);
        let rs = fs.createReadStream(filepath);
        rs.on('error', err => {
            console.log('error while computing hash: ' + err);
            reject(err);
        });
        rs.on('data', chunk => hash = hash.update(chunk));
        rs.on('end', () => resolve(hash.digest('hex')));
    });
}