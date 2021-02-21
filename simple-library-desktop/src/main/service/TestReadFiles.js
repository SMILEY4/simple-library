const fs = require('fs');
const crypto = require('crypto');
const exifr = require('exifr');

const exiftool = require('node-exiftool');
const exiftoolBin = require('dist-exiftool');
const exiftoolProcess = new exiftool.ExiftoolProcess(exiftoolBin);

const fileSmallJpg = 'D:\\LukasRuegner\\Bilder\\2019 Niederlande - BestOf\\LRM_EXPORT_757291498367834_20190812_144048700.jpeg';
const fileMartin = 'C:\\Users\\LukasRuegner\\Desktop\\testlibrary\\1803d0001.tif';


async function main() {

    await printExifData(fileMartin)
    console.log("===========================")
    await writeImageData(fileMartin)
    console.log("===========================")
    await printExifData(fileMartin)

    // const data2 = await getImageData(fileMartin);
    // console.log(JSON.stringify(data2));
}


main().then(function() {
});


async function getImageData(filepath) {
    const hash = await computeHash(fileMartin, 'md5');
    return {
        filepath: filepath,
        hash: hash,
    };
}

async function printExifData(filepath) {
    await exiftoolProcess
    .open()
    .then((pid) => console.log('Started exiftool process %s', pid))
    .then(() => exiftoolProcess.readMetadata(filepath, ['-File:all']))
    .then(console.log, console.error)
    .then(() => exiftoolProcess.close())
    .then(() => console.log('Closed exiftool'))
    .catch(console.error);
}

async function writeImageData(filepath) {
    await exiftoolProcess
    .open()
    .then(() => exiftoolProcess.writeMetadata(filepath, {
        // all: '', // remove existing tags
        ImageDescription: 'Modified by Simple Library',
        Artist: 'Martin Ruegner, Simple Library'
    }, ['overwrite_original'], false))
    .then(console.log, console.error)
    .then(() => exiftoolProcess.close())
    .then(() => console.log('Closed exiftool'))
    .catch(console.error);
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