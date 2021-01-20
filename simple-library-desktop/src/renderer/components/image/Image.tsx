import * as React from 'react';
import { ReactElement } from 'react';
import './image.css';
import '../layout/layout.css';
import { concatClasses, Fill, map, orDefault } from '../common';

export enum Size {
    AUTO = 'auto',
    COVER = 'cover',
    CONTAIN = 'contain',
}

interface ImageProps {
    url: string,
    size?: Size,
    posX?: string, // in %
    posY?: string, // in %
    offX?: number, // in px
    offY?: number, // in px
    fill?: Fill,
    className?: string
}


export function Image(props: React.PropsWithChildren<ImageProps>): ReactElement {

    function getClassNames(): string {
        return concatClasses(
            'image',
            orDefault(map(props.size, (size) => 'image-size-' + size), 'image-size-cover'),
            map(props.fill, (fill) => 'fill-' + fill),
            props.className,
        );
    }

    function getStyle(): any {
        return {
            backgroundImage: 'url(' + props.url + ')',
            backgroundPositionX: 'calc(' + (props.posX ? props.posX : '50%') + ' + ' + (props.offX ? props.offX : '0px') + ')',
            backgroundPositionY: 'calc(' + (props.posY ? props.posY : '50%') + ' + ' + (props.offY ? props.offY : '0px') + ')',
        };
    }

    return (
        <div className={getClassNames()}>
            <div className='image-main' style={getStyle()} />
            <div className='image-overlay'>
                {props.children}
            </div>
        </div>
    );
}
