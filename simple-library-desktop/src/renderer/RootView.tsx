import * as React from 'react';
import {Component} from 'react';
import {WelcomeView} from "_renderer/welcome/WelcomeView";
import {ComponentShowcaseView} from "_renderer/components/showcase/ComponentShowcaseView";

export enum Theme {
    LIGHT = "light",
    DARK = "dark"
}

interface RootState {
    theme: Theme,
    displayComponentShowcase: boolean
}

export class RootView extends Component<any, RootState> {

    constructor(props: any) {
        super(props);
        this.state = {
            theme: Theme.LIGHT,
            displayComponentShowcase: false
        }
        window.addEventListener('keyup', e => { // shift + alt + D => toggle component showcase
            if (e.key === 'D' && e.shiftKey && e.altKey) {
                this.setState({displayComponentShowcase: !this.state.displayComponentShowcase})
            }
        }, true)
    }

    render(): any {
        if (this.state.displayComponentShowcase) {
            return (
                <div className="root-view" style={{width: '100%', height: '100%'}}>
                    <ComponentShowcaseView/>
                </div>
            )
        } else {
            return (
                <div className={"root-view theme-" + this.state.theme}
                     style={{width: '100%', height: '100%',}}>
                    <WelcomeView
                        theme={this.state.theme}
                        onChangeTheme={() => {
                            const nextTheme: Theme = this.state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
                            this.setState({theme: nextTheme})
                        }}/>
                </div>
            )
        }
    }
}