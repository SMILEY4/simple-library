import React from "react";
import {MemoizedItemList} from "./ItemList";
import {VBox} from "../../../../components/layout/box/Box";
import {useContentArea} from "./useContentArea";

interface ContentAreaProps {
}

export function ContentArea(props: React.PropsWithChildren<ContentAreaProps>): React.ReactElement {

	const {
		activeCollection
	} = useContentArea()

	return activeCollection && (
		<VBox alignMain="start" alignCross="stretch" fill>

			<div style={{
				backgroundColor: "var(--color-background-1)",
				borderBottom: "1px solid var(--color-border)",
				padding: "var(--s-0-5)"
			}}>
				{activeCollection.name}
			</div>

			<MemoizedItemList activeCollection={activeCollection}/>

		</VBox>
	);

}
