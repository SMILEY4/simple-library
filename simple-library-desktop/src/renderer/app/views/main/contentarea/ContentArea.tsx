import React from "react";
import {ItemList} from "./ItemList";
import {VBox} from "../../../../newcomponents/layout/box/Box";
import {useCollections} from "../../../hooks/collectionHooks";

interface ContentAreaProps {
}

export function ContentArea(props: React.PropsWithChildren<ContentAreaProps>): React.ReactElement {

	const {
		activeCollectionId,
		findCollection
	} = useCollections();

	return activeCollectionId && (
		<VBox alignMain="start" alignCross="stretch" fill>
			<div style={{
				backgroundColor: "var(--color-background-1)",
				borderBottom: "1px solid var(--color-border)",
				padding: "var(--s-0-5)"
			}}>
				{findCollection(activeCollectionId).name}
			</div>
			<ItemList/>
		</VBox>
	);

}
