import * as React from 'react';
import { VBox } from '../../../components/layout/box/Box';
import { Fill } from '../../../components/common/common';
import { Grid } from '../../../components/layout/grid/Grid';
import { componentDidMount } from '../../common/utils/functionalReactLifecycle';
import { useGroups } from '../../hooks/groupHooks';
import { NotificationStack } from '../../../components/_old/notification/NotificationStack';
import { genNotificationId, toNotificationEntries } from '../../common/utils/notificationUtils';
import { AppNotificationType } from '../../store/state';
import { ItemList } from './itemPanel/ItemList';
import { fetchRootGroup } from '../../common/messaging/messagingInterface';
import { MenuSidebar } from './menusidebar/MenuSidebar';
import { useNotifications } from '../../hooks/miscHooks';

interface NewMainViewProps {
    onActionClose: () => void
}

export function MainView(props: React.PropsWithChildren<NewMainViewProps>): React.ReactElement {

    const { notifications, addNotification, removeNotification } = useNotifications();
    const { setRootGroup } = useGroups();

    componentDidMount(() => {
        fetchRootGroup()
            .then(setRootGroup)
            .catch(error => addNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error));
    });

    return (
        <VBox>
            <Grid columns={['auto', '1fr']} rows={['100vh']} fill={Fill.TRUE} style={{ maxHeight: "100vh" }}>
                <MenuSidebar onActionClose={props.onActionClose} />
                <ItemList />
            </Grid>
            <NotificationStack modalRootId='root' notifications={toNotificationEntries(notifications, removeNotification)} />
        </VBox>
    );
}
