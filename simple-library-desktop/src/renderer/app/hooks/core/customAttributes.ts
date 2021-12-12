import {AttributeKeyDTO, AttributeMetaDTO} from "../../../../common/events/dtoModels";
import {
	fetchCustomAttributes,
	requestCreateCustomAttributes,
	requestDeleteCustomAttributes
} from "../../common/eventInterface";

export function useCustomAttributes() {

	function get(): Promise<AttributeMetaDTO[]> {
		return fetchCustomAttributes();
	}

	function addCustomAttributes(entries: AttributeKeyDTO[]): Promise<void> {
		return requestCreateCustomAttributes(entries);
	}

	function deleteCustomAttributes(attributeIds: number[]): Promise<void> {
		return requestDeleteCustomAttributes(attributeIds);
	}

	return {
		getCustomAttributes: get,
		addCustomAttributes: addCustomAttributes,
		deleteCustomAttributes: deleteCustomAttributes
	};
}
