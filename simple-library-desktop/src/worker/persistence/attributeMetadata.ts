import {FileSystemWrapper} from "../service/fileSystemWrapper";
import path from "path";

const htmlparser2 = require("htmlparser2");

export module AttributeMetadata {

	export interface AttribMetaEntry {
		name: string,
		type: string,
		writable: boolean,
		g0: string | undefined,
		g1: string | undefined,
		g2: string | undefined
	}

	export function getDataCollected(fsWrapper: FileSystemWrapper, isDev: boolean): AttribMetaEntry[] {
		const entries: AttribMetaEntry[] = [];
		getDataAsBlocks(fsWrapper, isDev, 100, data => entries.push(...data));
		return entries;
	}

	export function getDataAsBlocks(
		fsWrapper: FileSystemWrapper,
		isDev: boolean,
		blockSize: number,
		consumeBlock: (data: AttribMetaEntry[]) => void
	): void {
		let tags: AttribMetaEntry[] = [];
		const lastGroup = {
			name: "",
			g0: "",
			g1: "",
			g2: ""
		};
		const parser = new htmlparser2.Parser({
				async onopentag(name: string, attribs: { [p: string]: string }): Promise<void> {
					if (name === "table") {
						lastGroup.name = attribs.name;
						lastGroup.g0 = attribs.g0;
						lastGroup.g1 = attribs.g1;
						lastGroup.g2 = attribs.g2;
					}
					if (name === "tag") {
						tags.push({
							name: attribs.name,
							type: attribs.type,
							writable: attribs.writable === "true",
							g0: attribs.g0 ? attribs.g0 : lastGroup.g0,
							g1: attribs.g1 ? attribs.g1 : lastGroup.g1,
							g2: attribs.g2 ? attribs.g2 : lastGroup.g2
						});
					}
					if (tags.length >= blockSize) {
						consumeBlock(tags);
						tags = [];
					}
				}
			},
			{
				xmlMode: true
			});
		parser.write(getAttributeMetadataXml(fsWrapper, isDev));
		parser.end();
		if (tags.length > 0) {
			consumeBlock(tags);
		}
	}

	export function getAttributeMetadataXml(fsWrapper: FileSystemWrapper, isDev: boolean): string {
		const filepath = path.join(__dirname, "files", "attributeMetadata.xml");
		console.log("Read AttributeMetadataXml at ", filepath);
		return fsWrapper.readFile(isDev ? filepath : "todo.xml"); // Todo: prod path
	}

}

