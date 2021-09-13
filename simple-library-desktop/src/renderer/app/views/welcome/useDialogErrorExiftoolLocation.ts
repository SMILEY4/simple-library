import {useDialogController} from "../../hooks/miscApplicationHooks";
import {fetchExiftoolData} from "../../common/eventInterface";
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
