import {DataRepository} from "../dataRepository";
import {AttributeKey, attributeKeysEquals, rowsToAttributeKeys} from "../item/itemCommon";
import {voidThen} from "../../../common/utils";

/**
 * Hides/Shows the given attributes
 */
export class ActionSetHiddenAttributes {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(attributes: AttributeKey[], mode: "hide" | "show"): Promise<void> {
		if (attributes && attributes.length > 0) {
			return mode === "hide"
				? this.hide(attributes).then(voidThen)
				: this.show(attributes).then(voidThen);
		} else {
			return Promise.resolve();
		}
	}

	private async hide(attributes: AttributeKey[]): Promise<any> {
		const hiddenAttribs: AttributeKey[] = await this.repository.getHiddenAttributes().then(rowsToAttributeKeys);
		const attribsToInsert = attributes.filter(attrib => hiddenAttribs.findIndex(hAttrib => attributeKeysEquals(attrib, hAttrib)) === -1);
		return this.repository.insertHiddenAttributes(attribsToInsert);
	}

	private async show(attributes: AttributeKey[]): Promise<any> {
		for (let i = 0; i < attributes.length; i++) {
			const attrib = attributes[i];
			await this.repository.deleteHiddenAttribute(attrib.id, attrib.name, attrib.g0, attrib.g1, attrib.g2);
		}
	}

}
