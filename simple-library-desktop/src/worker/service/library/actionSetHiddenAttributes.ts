import {DataRepository} from "../dataRepository";
import {voidThen} from "../../../common/utils";
import {rowsToAttributeMeta} from "./libraryCommons";

/**
 * Hides/Shows the given attributes
 */
export class ActionSetHiddenAttributes {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(attributeIds: number[], mode: "hide" | "show"): Promise<void> {
		if (attributeIds && attributeIds.length > 0) {
			return mode === "hide"
				? this.hide(attributeIds).then(voidThen)
				: this.show(attributeIds).then(voidThen);
		} else {
			return Promise.resolve();
		}
	}

	private async hide(attributeIds: number[]): Promise<any> {
		const hiddenAttribs = await this.repository.getHiddenAttributes().then(rowsToAttributeMeta);
		const attribsToInsert = attributeIds.filter(attId => hiddenAttribs.findIndex(hAttrib => hAttrib.attId === attId) === -1);
		return this.repository.insertHiddenAttributes(attribsToInsert);
	}

	private async show(attributeIds: number[]): Promise<any> {
		for (let i = 0; i < attributeIds.length; i++) {
			await this.repository.deleteHiddenAttribute(attributeIds[i]);
		}
	}

}
