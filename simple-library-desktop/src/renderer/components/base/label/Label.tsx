import * as React from 'react';
import { ReactElement } from 'react';
import { HBox } from '../../layout/box/Box';
import { BaseProps, ColorType, concatClasses, map, orDefault, Size } from '../../common/common';
import { Icon } from '../icon/Icon';

interface LabelProps extends BaseProps {
    color?: ColorType,
}


export function Label(props: React.PropsWithChildren<LabelProps>): ReactElement {

    const modifiedChildren = React.Children.map(props.children, child => {
        if (React.isValidElement(child) && (child as React.ReactElement<any>).type === Icon) {
            return React.cloneElement(child, { color: getContentColor() });
        } else {
            return child;
        }
    });

    return (
        <HBox spacing={Size.S_0_25}
              className={concatClasses("label", props.className, map(getContentColor(), color => "text-color-" + color))}
              style={props.style}
        >
            {modifiedChildren}
        </HBox>
    );

    function getContentColor(): ColorType {
        return orDefault(props.color, ColorType.TEXT_2);
    }

}
