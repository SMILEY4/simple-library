const htmlparser2 = require("htmlparser2");
const fs = require("fs");



async function printStaticData() {
	console.log(JSON.stringify(getData(), null, "   "));
}


function readXML() {
	return fs.readFileSync("D:\\LukasRuegner\\Programmieren\\Workspace\\simple-library\\simple-library-desktop\\src\\worker\\persistence\\files\\tagsSmall.xml")+"";
}

 function getData() {
	const tags = [];

	const lastGroup = {
		name: "",
		g0: "",
		g1: "",
		g2: ""
	}

	const parser = new htmlparser2.Parser({
			onopentag(name, attribs, isImplied) {
				if(name === "table") {
					lastGroup.name = attribs.name;
					lastGroup.g0 = attribs.g0;
					lastGroup.g1 = attribs.g1;
					lastGroup.g2 = attribs.g2;
				}
				if(name === "tag") {
					tags.push({
						name: attribs.name,
						type: attribs.type,
						writable: attribs.writable,
						g0: attribs.g0 ? attribs.g0 : lastGroup.g0,
						g1: attribs.g1 ? attribs.g1 : lastGroup.g1,
						g2: attribs.g2 ? attribs.g2 : lastGroup.g2,
					})
				}
			},
		},
		{
			xmlMode: true
		});

	parser.write(readXML());
	parser.end();

	return tags;
}



printStaticData()