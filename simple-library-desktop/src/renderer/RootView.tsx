import * as React from 'react';
import {ComponentShowcaseView} from "_renderer/components/showcase/ComponentShowcaseView";

export function RootView(): any {
    return (
        <div className="root-view" style={{width: '100%', height: '100%'}}>
            <ComponentShowcaseView/>
        </div>
    )
}