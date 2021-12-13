import {DataRepository} from "../dataRepository";
import {AttributeMeta, DefaultAttributeValueEntry} from "./libraryCommons";
import {AttributeKey} from "../item/itemCommon";
import {voidThen} from "../../../common/utils";
import {ArrayUtils} from "../../../common/arrayUtils";
import {ActionGetCustomAttributeMeta} from "./actionGetCustomAttributeMeta";
import {ActionGetLibraryAttributeMetaByKeys} from "./actionGetLibraryAttributeMetaByKeys";
import {ActionGetDefaultAttributeValues} from "./actionGetDefaultAttributeValues";

/**
 * Create custom attribute metadata
 */
export class ActionCreateCustomAttributeMeta {

	private readonly repository: DataRepository;
	private readonly actionGetCustomAttributeMeta: ActionGetCustomAttributeMeta;
	private readonly actionGetAttributeMetaByKeys: ActionGetLibraryAttributeMetaByKeys;
	private readonly actionGetDefaultAttributeValues: ActionGetDefaultAttributeValues;

	constructor(
		repository: DataRepository,
		actionGetCustomAttributeMeta: ActionGetCustomAttributeMeta,
		actionGetAttributeMetaByKeys: ActionGetLibraryAttributeMetaByKeys,
		actionGetDefaultAttributeValues: ActionGetDefaultAttributeValues
	) {
		this.repository = repository;
		this.actionGetCustomAttributeMeta = actionGetCustomAttributeMeta;
		this.actionGetAttributeMetaByKeys = actionGetAttributeMetaByKeys;
		this.actionGetDefaultAttributeValues = actionGetDefaultAttributeValues;
	}

	public perform(keys: AttributeKey[]): Promise<void> {
		return this.actionGetCustomAttributeMeta.perform()
			.then(meta => this.filterToInsert(keys, meta))
			.then(k => this.insert(k))
			.then(k => this.getInsertedAttributeIds(k))
			.then(attIds => this.getInitialValues(attIds))
			.then(entries => this.setAttributeWhereMissing(entries))
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

	private insert(keys: AttributeKey[]): Promise<AttributeKey[]> {
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
			}))).then(() => keys)
		}
	}

	private wip(keys: AttributeKey[]) {
		return this.actionGetAttributeMetaByKeys.perform(keys)
			.then(meta => meta.map(m => m.attId))
	}

	private getInsertedAttributeIds(keys: AttributeKey[]): Promise<number[]> {
		return this.actionGetAttributeMetaByKeys.perform(keys)
			.then(meta => meta.map(m => m.attId))
	}


	private getInitialValues(attributeIds: number[]): Promise<({ attId: number, value: string })[]> {
		return this.actionGetDefaultAttributeValues.perform().then((entries: DefaultAttributeValueEntry[]) => {
			return attributeIds.map(attId => {
				const defaultEntry = entries.find(e => e.attributeMeta.attId === attId)
				return defaultEntry
					? ({attId: attId, value: defaultEntry.defaultValue})
					: ({attId: attId, value: ""})
			})
		})
	}

	private async setAttributeWhereMissing(entries: ({ attId: number, value: string })[]): Promise<any> {
		for (let entry of entries) {
			await this.repository.insertItemAttributeWhereMissing(entry.attId, entry.value)
		}
	}

}
