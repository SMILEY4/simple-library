import {BaseProps} from "../../utils/common";
import {concatClasses, getIf, map} from "../../../components/common/common";

export interface BaseElementProps extends BaseProps {
	error?: boolean,
	groupPos?: "left" | "right" | "center",
	allowOverflow?: boolean,
}

export function getBaseElementClasses(props: BaseElementProps): string {
	return concatClasses(
		"base-elem",
		getIf(props.error, "base-elem-state-error"),
		getIf(props.allowOverflow, "base-elem-allow-overflow"),
		map(props.groupPos, groupPos => "base-elem-" + groupPos)
	)
}
