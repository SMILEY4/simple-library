import {FileSystemWrapper} from "../service/fileSystemWrapper";
import path from "path";

const htmlparser2 = require("htmlparser2");

export interface AttribMetaEntry {
	id: string,
	name: string,
	g0: string | undefined,
	g1: string | undefined,
	g2: string | undefined
	type: string,
	writable: boolean,
	custom: boolean
}

export class AttributeMetadataProvider {

	private readonly isDev: boolean;
	private readonly isRemoteWorker: boolean;

	constructor(isDev: boolean, isRemoveWorker: boolean) {
		this.isDev = isDev;
		this.isRemoteWorker = isRemoveWorker;
	}

	public getDataCollected(fsWrapper: FileSystemWrapper): AttribMetaEntry[] {
		const entries: AttribMetaEntry[] = [];
		this.getDataAsBlocks(fsWrapper,100, data => entries.push(...data));
		return entries;
	}

	public getDataAsBlocks(
		fsWrapper: FileSystemWrapper,
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
							id: attribs.id,
							name: attribs.name,
							g0: attribs.g0 ? attribs.g0 : lastGroup.g0,
							g1: attribs.g1 ? attribs.g1 : lastGroup.g1,
							g2: attribs.g2 ? attribs.g2 : lastGroup.g2,
							type: attribs.type,
							writable: attribs.writable === "true",
							custom: false,
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
		parser.write(this.getAttributeMetadataXml(fsWrapper));
		parser.end();
		if (tags.length > 0) {
			consumeBlock(tags);
		}
	}


	private getAttributeMetadataXml(fsWrapper: FileSystemWrapper): string {
		const filepath = this.getPath(this.isDev, this.isRemoteWorker);
		console.log("Read AttributeMetadataXml at ", filepath);
		return fsWrapper.readFile(filepath);
	}

	private getPath(isDev: boolean, isRemoteWorker: boolean): string {
		const app = isRemoteWorker
			? require("electron").remote.app
			: require("electron").app;
		const pathBase = isDev
			? path.dirname(app.getAppPath())
			: path.dirname(app.getPath("exe"));
		const pathRes = isDev
			? "../src/resourcefiles"
			: "resources/resourcefiles";
		const filename = "attributeMetadata.xml";
		return path.join(pathBase, pathRes, filename);
	}

}

