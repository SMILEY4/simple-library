import {ArrayUtils} from "../../../../../../common/arrayUtils";
import {useState} from "react";
import {
	FilterExpressionTypeDTO, FilterOperationTypeDTO, ItemFilterConditionDTO,
	ItemFilterDTO,
	ItemFilterExpressionDTO
} from "../../../../../../common/events/dtoModels";


export function useDialogItemFilter(initFilter: ItemFilterDTO | null) {


	const [filter, setFilter] = useState<ItemFilterDTO>(initFilter);


	function setRoot(type: FilterExpressionTypeDTO) {
		if (type === "condition") {
			setFilter({
				id: "root",
				type: "condition",
				attributeId: "",
				operation: "eq",
				value: ""
			});
		} else {
			setFilter({
				id: "root",
				type: type,
				childFilters: []
			});
		}
	}

	function addExpression(parentId: string, addedType: "and" | "or" | "not" | "condition") {
		const newFilter: ItemFilterDTO = {...filter};
		walkFilter(
			newFilter,
			() => true,
			(current: ItemFilterExpressionDTO) => {
				if (current.id === parentId) {
					current.childFilters = [{
						id: Math.random() + "" + Date.now(),
						type: addedType,
						value: "",
						childFilters: []
					}, ...current.childFilters];
					return false;
				} else {
					return true;
				}
			}
		);
		setFilter(newFilter);
	}

	function removeExpression(id: string) {
		if (filter) {
			if (filter.id === id) {
				setFilter(null);
			} else {
				const newFilter: ItemFilterDTO = {...filter};
				walkFilter(
					newFilter,
					() => true,
					(current: ItemFilterExpressionDTO) => {
						if (current.childFilters.some(c => c.id === id)) {
							ArrayUtils.removeInPlace(current.childFilters, id, (a, b) => a.id === b);
							return false;
						} else {
							return true;
						}
					}
				);
				setFilter(newFilter);
			}

		}

	}

	function setAttribute(id: string, attributeId: string) {
		const newFilter: ItemFilterDTO = {...filter};
		walkFilter(
			newFilter,
			(filter: ItemFilterConditionDTO) => {
				if (filter.id === id) {
					filter.attributeId = attributeId;
					return false;
				} else {
					return true;
				}
			},
			() => true
		);
		setFilter(newFilter);
	}

	function setOperation(id: string, op: FilterOperationTypeDTO) {
		const newFilter: ItemFilterDTO = {...filter};
		walkFilter(
			newFilter,
			(filter: ItemFilterConditionDTO) => {
				if (filter.id === id) {
					filter.operation = op;
					return false;
				} else {
					return true;
				}
			},
			() => true
		);
		setFilter(newFilter);
	}

	function setValue(id: string, value: string) {
		const newFilter: ItemFilterDTO = {...filter};
		walkFilter(
			newFilter,
			(filter: ItemFilterConditionDTO) => {
				if (filter.id === id) {
					filter.value = value;
					return false;
				} else {
					return true;
				}
			},
			() => true
		);
		setFilter(newFilter);
	}

	function walkFilter(
		filter: ItemFilterDTO,
		onCondition: (filter: ItemFilterConditionDTO) => boolean,
		onExpression: (filter: ItemFilterExpressionDTO) => boolean
	) {
		if (filter.type === "condition") {
			if (!onCondition(filter as ItemFilterConditionDTO)) {
				return false;
			}
		} else {
			const expr = filter as ItemFilterExpressionDTO;
			if (!onExpression(expr)) {
				return false;
			}
			for (let child of expr.childFilters) {
				if (!walkFilter(child, onCondition, onExpression)) {
					return false;
				}
			}
		}
		return true;
	}

	return {
		filter: filter,
		setFilter: setRoot,
		addExpression: addExpression,
		removeExpression: removeExpression,
		setAttribute: setAttribute,
		setOperation: setOperation,
		setValue: setValue
	};

}

