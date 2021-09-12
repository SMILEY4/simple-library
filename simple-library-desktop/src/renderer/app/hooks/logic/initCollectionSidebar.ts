import {useMount} from "../../../components/utils/commonHooks";
import {fetchRootGroup} from "../../common/messagingInterface";
import {genNotificationId} from "../base/notificationUtils";
import {AppNotificationType} from "../../store/notificationState";
import {GroupDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetRootGroup} from "../../store/collectionsState";
import {useModifyNotifications} from "../base/notificationHooks";

export function useInitCollectionSidebar() {

	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const {throwErrorNotification} = useModifyNotifications()

	useMount(() => fetchRootGroup()
		.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
		.then((group: GroupDTO) => dispatchSetRootGroup(group))
	);

}
