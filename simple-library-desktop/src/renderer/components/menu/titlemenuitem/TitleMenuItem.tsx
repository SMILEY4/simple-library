import * as React from 'react';
import { ReactElement } from 'react';
import "./titlemenuitem.css";
import { BaseProps } from '../../common/common';
import { CaptionText } from '../../base/text/Text';

export interface TitleMenuItemProps extends BaseProps {
    title: string
}

export function TitleMenuItem(props: React.PropsWithChildren<TitleMenuItemProps>): ReactElement {
    return (
        <div className={"title-menu-item"}>
            <CaptionText bold>{props.title}</CaptionText>
        </div>
    );
}
