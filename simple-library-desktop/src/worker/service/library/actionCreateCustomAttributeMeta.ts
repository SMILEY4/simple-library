import {DataRepository} from "../dataRepository";
import {AttributeMeta} from "./libraryCommons";
import {AttributeKey} from "../item/itemCommon";
import {voidThen} from "../../../common/utils";
import {ArrayUtils} from "../../../common/arrayUtils";
import {ActionGetCustomAttributeMeta} from "./actionGetCustomAttributeMeta";

/**
 * Create custom attribute metadata
 */
export class ActionCreateCustomAttributeMeta {

	private readonly repository: DataRepository;
	private readonly actionGetCustomAttributeMeta: ActionGetCustomAttributeMeta;

	constructor(repository: DataRepository, actionGetCustomAttributeMeta: ActionGetCustomAttributeMeta) {
		this.repository = repository;
		this.actionGetCustomAttributeMeta = actionGetCustomAttributeMeta;
	}

	public perform(keys: AttributeKey[]): Promise<void> {
		return this.actionGetCustomAttributeMeta.perform()
			.then(meta => this.filterToInsert(keys, meta))
			.then(k => this.insert(k))
			.then(voidThen)
	}

	private filterToInsert(keys: AttributeKey[], existing: AttributeMeta[]): AttributeKey[] {
		return keys.filter(key => {
			return ArrayUtils.containsNot(existing, key, (a, b) => {
				const keyA = a.key;
				return keyA.id === b.id
					&& keyA.name === b.name
					&& keyA.g0 === b.g0
					&& keyA.g1 === b.g1
					&& keyA.g2 === b.g2
			})
		})
	}

	private insert(keys: AttributeKey[]) {
		if (keys && keys.length > 0) {
			return this.repository.insertAttributeMeta(keys.map(key => ({
				id: key.id,
				name: key.name,
				g0: key.g0,
				g1: key.g1,
				g2: key.g2,
				type: "?",
				writable: true,
				custom: true
			})))
		}
	}

}
