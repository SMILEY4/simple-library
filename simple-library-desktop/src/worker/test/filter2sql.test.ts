import {
	convertItemFilterToSqlQuery,
	FilterOperationType,
	ItemFilter,
	ItemFilterCondition,
	ItemFilterExpression
} from "../service/item/itemCommon";

describe("item-filter-to-sql-query", () => {


	test("convert simple equals-condition", async () => {
		const sqlQuery = convertItemFilterToSqlQuery(
			condition("myAtt", "eq", "myValue")
		);
		expect(sqlQuery).toBe("attribs.attribute_identifier = 'myAtt' AND attribs.value = 'myValue'");
	});

	test("convert simple like-condition", async () => {
		const sqlQuery = convertItemFilterToSqlQuery(
			condition("myAtt", "like", "myValue%")
		);
		expect(sqlQuery).toBe("attribs.attribute_identifier = 'myAtt' AND attribs.value LIKE 'myValue%'");
	});

	test("convert simple AND", async () => {
		const sqlQuery = convertItemFilterToSqlQuery(
			and([
				condition("myAtt1", "eq", "myValue1"),
				condition("myAtt2", "like", "myValue2")
			])
		);
		expect(sqlQuery).toBe("(attribs.attribute_identifier = 'myAtt1' AND attribs.value = 'myValue1') AND (attribs.attribute_identifier = 'myAtt2' AND attribs.value LIKE 'myValue2')");
	});

	test("convert simple AND with one child", async () => {
		const sqlQuery = convertItemFilterToSqlQuery(
			and([
				condition("myAtt", "eq", "myValue"),
			])
		);
		expect(sqlQuery).toBe("(attribs.attribute_identifier = 'myAtt' AND attribs.value = 'myValue')");
	});


	test("convert simple OR", async () => {
		const sqlQuery = convertItemFilterToSqlQuery(
			or([
				condition("myAtt1", "eq", "myValue1"),
				condition("myAtt2", "like", "myValue2")
			])
		);
		expect(sqlQuery).toBe("(attribs.attribute_identifier = 'myAtt1' AND attribs.value = 'myValue1') OR (attribs.attribute_identifier = 'myAtt2' AND attribs.value LIKE 'myValue2')");
	});


	test("convert simple NOT", async () => {
		const sqlQuery = convertItemFilterToSqlQuery(
			not([
				condition("myAtt", "eq", "myValue"),
			])
		);
		expect(sqlQuery).toBe("NOT (attribs.attribute_identifier = 'myAtt' AND attribs.value = 'myValue')");
	});


	test("convert simple NOT multiple children", async () => {
		const sqlQuery = convertItemFilterToSqlQuery(
			not([
				condition("myAtt1", "eq", "myValue1"),
				condition("myAtt2", "like", "myValue2")
			])
		);
		expect(sqlQuery).toBe("NOT (attribs.attribute_identifier = 'myAtt1' AND attribs.value = 'myValue1')");
	});

	test("convert deeply nested", async () => {
		const sqlQuery = convertItemFilterToSqlQuery(
			and([
				condition("myAtt1", "eq", "myValue1"),
				not([
					or([
						condition("myAtt2", "like", "myValue2"),
						and([
							condition("myAtt3", "eq", "myValue3"),
							condition("myAtt4", "like", "myValue4"),
							condition("myAtt5", "eq", "myValue5")

						]),
						or([
							condition("myAtt6", "eq", "myValue6"),
							condition("myAtt7", "eq", "myValue7")
						])
					])
				]),
				condition("myAtt8", "like", "myValue8")
			])
		);
		expect(sqlQuery).toBe("(attribs.attribute_identifier = 'myAtt1' AND attribs.value = 'myValue1') AND (NOT ((attribs.attribute_identifier = 'myAtt2' AND attribs.value LIKE 'myValue2') OR ((attribs.attribute_identifier = 'myAtt3' AND attribs.value = 'myValue3') AND (attribs.attribute_identifier = 'myAtt4' AND attribs.value LIKE 'myValue4') AND (attribs.attribute_identifier = 'myAtt5' AND attribs.value = 'myValue5')) OR ((attribs.attribute_identifier = 'myAtt6' AND attribs.value = 'myValue6') OR (attribs.attribute_identifier = 'myAtt7' AND attribs.value = 'myValue7')))) AND (attribs.attribute_identifier = 'myAtt8' AND attribs.value LIKE 'myValue8')");
	});




	test("convert deeply nested with empty expressions", async () => {
	});

});


function condition(attributeIdentifier: string, operation: FilterOperationType, value: string): ItemFilterCondition {
	return {
		type: "condition",
		attributeId: attributeIdentifier,
		operation: operation,
		value: value
	};
}

function and(children: ItemFilter[]): ItemFilterExpression {
	return {
		type: "and",
		childFilters: children
	};
}

function or(children: ItemFilter[]): ItemFilterExpression {
	return {
		type: "or",
		childFilters: children
	};
}

function not(children: ItemFilter[]): ItemFilterExpression {
	return {
		type: "not",
		childFilters: children
	};
}