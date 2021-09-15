import {fetchExiftoolData} from "../../common/eventInterface";
import {useEffect, useState} from "react";

export function useExiftoolMissingError() {
	const [show, setShow] = useState(false);

	useEffect(() => {
		fetchExiftoolData().then(([location, isDefined]) => {
			if (!isDefined) {
				setShow(true);
			}
		})
	})

	return show;
}
