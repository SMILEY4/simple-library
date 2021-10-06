const exiftool = require('node-exiftool');


function createExiftoolProc() {
	return new exiftool.ExiftoolProcess("C:\\Users\\LukasRuegner\\Desktop\\testlibrary\\exiftool.exe");
}


async function printImageData(filepath) {
	const ep = createExiftoolProc();
	await ep
	.open()
	.then((pid) => console.log('Started exiftool process %s', pid))
	.then(() => ep.readMetadata(filepath, ['-File:all', 'g0:1:2']))
	.then(data => parseExifOutput(data))
	.then(data => console.log(JSON.stringify(data, null, "   ")))
	.then(() => ep.close())
	.then(() => console.log('Closed exiftool'))
	.catch(console.error);
}


function parseExifOutput(out) {
	const data = out.data[0];
	const attribs = [];

	iterateObj(data, (key, value) => {
		if ((typeof value) == "object") {
			iterateObj(value, (nKey, nValue) => {
				attribs.push({
					name: nKey,
					value: nValue,
					g0: getAt(key.split(":"), 0),
					g1: getAt(key.split(":"), 1),
					g2: getAt(key.split(":"), 2)
				})
			})

		} else {
			attribs.push({
				name: key,
				value: value
			})
		}
	})

	return attribs;
}


function iterateObj(obj, onField) {
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			onField(key, obj[key]);
		}
	}
}


function getAt(arr, index) {
	if (index >= arr.length) {
		return undefined;
	} else {
		return arr[index];
	}
}


printImageData("C:\\Users\\LukasRuegner\\Desktop\\testlibrary\\Elite Dangerous_20180801105821.png")