import {DataRepository} from "../dataRepository";
import {DefaultAttributeValueEntry} from "./libraryCommons";
import {voidThen} from "../../../common/utils";

/**
 * Set all default values for attributes (overwrites existing)
 */
export class ActionSetDefaultAttributeValues {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(entries: DefaultAttributeValueEntry[]): Promise<void> {
		return this.deleteAll()
			.then(() => this.insert(entries))
			.then(voidThen);
	}

	private deleteAll(): Promise<any> {
		return this.repository.deleteAllDefaultAttributeValues();
	}

	private insert(entries: DefaultAttributeValueEntry[]): Promise<any> {
		if (entries && entries.length > 0) {
			return this.repository.insertDefaultAttributeValues(entries.map(e => ({
				attId: e.attributeMeta.attId,
				value: e.defaultValue,
				allowOverwrite: e.allowOverwrite
			})));
		} else {
			return Promise.resolve();
		}
	}

}
