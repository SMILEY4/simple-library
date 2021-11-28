import {DefaultAttributeValueEntryDTO} from "../../../../common/events/dtoModels";
import {fetchDefaultAttributeValues, requestSetDefaultAttributeValues} from "../../common/eventInterface";
import {voidThen} from "../../../../common/utils";

export function useDefaultAttributeValues() {

	function get(): Promise<DefaultAttributeValueEntryDTO[]> {
		return fetchDefaultAttributeValues();
	}

	function setEntries(entries: DefaultAttributeValueEntryDTO[]): Promise<void> {
		return requestSetDefaultAttributeValues(entries).then(voidThen);
	}

	return {
		getDefaultAttributeValues: get,
		setDefaultAttributeValues: setEntries
	};
}
