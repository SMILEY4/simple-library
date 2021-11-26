import {useEffect, useState} from "react";
import {fetchApplicationConfig, requestUpdateApplicationConfig} from "../../common/eventInterface";
import {ApplicationConfigDTO} from "../../../../common/events/dtoModels";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {genNotificationId} from "../../common/notificationUtils";
import {voidThen} from "../../../../common/utils";
import {useDispatchSetTheme} from "../store/appStore";

export function useApplicationConfig() {

	const [config, setConfig] = useState<ApplicationConfigDTO | null>(null);
	const throwErrorNotification = useThrowErrorWithNotification();
	const setTheme = useDispatchSetTheme();

	useEffect(() => {
		fetchConfig().then(cfg => cfg && setConfig(cfg));
	}, []);

	function set(config: ApplicationConfigDTO): void {
		setConfig(config);
	}

	function commit(): Promise<void> {
		return requestUpdateApplicationConfig(config)
			.then(() => fetchConfig())
			.then(cfg => cfg && setConfig(cfg))
			.then(() => setTheme(config.theme))
			.then(voidThen);
	}

	function discard(): Promise<void> {
		return fetchConfig()
			.then(cfg => cfg && setConfig(cfg))
			.then(voidThen);
	}

	function fetchConfig(): Promise<ApplicationConfigDTO | void> {
		return fetchApplicationConfig()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GENERIC, error));
	}

	return {
		config: config,
		setAppConfig: set,
		commitAppConfig: commit,
		discardAppConfig: discard
	};
}
