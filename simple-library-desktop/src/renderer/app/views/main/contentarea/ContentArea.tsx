import React, {useEffect} from "react";
import {ItemList} from "./ItemList";
import {VBox} from "../../../../components/layout/box/Box";
import {useCollections} from "../../../hooks/collectionHooks";
import {Collection} from "../../../../../common/commonModels";

interface ContentAreaProps {
}

export function ContentArea(props: React.PropsWithChildren<ContentAreaProps>): React.ReactElement {

	const {
		activeCollectionId,
		findCollection
	} = useCollections();

	const activeCollection: Collection | null = findCollection(activeCollectionId);

	return activeCollectionId && activeCollection && (
		<VBox alignMain="start" alignCross="stretch" fill>
			<div style={{
				backgroundColor: "var(--color-background-1)",
				borderBottom: "1px solid var(--color-border)",
				padding: "var(--s-0-5)"
			}}>
				{activeCollection.name}
			</div>
			<ItemList/>
		</VBox>
	);

}
