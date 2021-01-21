import * as React from 'react';
import { ReactElement } from 'react';
import './testview.css';


interface TestViewProps {
}


export function TestView(props: React.PropsWithChildren<TestViewProps>): ReactElement {

    return (
        <div>
            testing view
        </div>
    );
}
