import * as React from 'react';
import { VBox } from '../../components/layout/Box';
import { Fill } from '../../components/common';
import { Grid } from '../../components/layout/Grid';
import { componentWillMount } from '../common/functionalReactLifecycle';
import { useNotifications, useRootGroup } from '../common/hooks';
import { NotificationStack } from '../../components/notification/NotificationStack';
import { genNotificationId, toNotificationEntries } from '../common/notificationUtils';
import { AppNotificationType } from '../store/state';
import { ItemList } from './itemPanel/ItemList';
import { MenuSidebar } from './newMenuSidebar/MenuSidebar';
import { fetchRootGroup } from '../common/messagingInterface';

interface NewMainViewProps {
    onActionClose: () => void
}

export function NewMainView(props: React.PropsWithChildren<NewMainViewProps>): React.ReactElement {

    const { notifications, addNotification, removeNotification } = useNotifications();
    const { setRootGroup } = useRootGroup();

    componentWillMount(() => {
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
