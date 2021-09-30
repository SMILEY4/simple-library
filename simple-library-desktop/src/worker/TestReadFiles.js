const exiftool = require("node-exiftool");


const exiftoolProcess = new exiftool.ExiftoolProcess("C:\\Users\\LukasRuegner\\Desktop\\testlibrary\\exiftool.exe");


async function main() {

	const file = "C:\\Users\\LukasRuegner\\Desktop\\testlibrary\\Elite Dangerous_20180801112140.png";

	await printExifData(file)
	console.log("===========================")
	await writeImageData(file)
	console.log("===========================")
	await printExifData(file)
}


main().then(function () {
});


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
