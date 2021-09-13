import {useDialogController} from "../../hooks/base/miscApplicationHooks";
import {fetchExiftoolData} from "../../common/messagingInterface";
import {useEffect} from "react";

export function useDialogErrorExiftoolLocationController() {
	const [show, open, close] = useDialogController();

	useEffect(() => {
		fetchExiftoolData().then(([location, isDefined]) => {
			if (!isDefined) {
				open();
			}
		})
	})

	return show;
}
