import * as React from "react";
import {ReactElement} from "react";

interface ComposeProps {
	components: Array<React.JSXElementConstructor<React.PropsWithChildren<any>>>
}

export function Compose(props: React.PropsWithChildren<ComposeProps>): ReactElement {

	return (
		<>
			{props.components.reduceRight(
				(acc, Comp) => <Comp>{acc}</Comp>,
				props.children
			)}
		</>
	);

}
