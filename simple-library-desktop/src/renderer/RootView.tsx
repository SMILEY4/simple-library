import * as React from 'react';
import {Component} from 'react';
import {WelcomeView} from "_renderer/welcome/WelcomeView";
import {ComponentShowcaseView} from "_renderer/components/showcase/ComponentShowcaseView";
import {onSwitchedToMainScreen, onSwitchedToWelcomeScreen} from "_main/Messages";
import {MainView} from "_renderer/main/MainView";

const {ipcRenderer} = window.require('electron');

export enum Theme {
    LIGHT = "light",
    DARK = "dark"
}

export enum View {
    WELCOME = "welcome",
    MAIN = "main"
}

interface RootState {
    theme: Theme,
    currentView: View,
    displayComponentShowcase: boolean
}

export class RootView extends Component<any, RootState> {

    constructor(props: any) {
        super(props);
        this.state = {
            theme: Theme.LIGHT,
            currentView: View.WELCOME,
            displayComponentShowcase: false
        }

        window.addEventListener('keyup', e => { // shift + alt + D => toggle component showcase
            if (e.key === 'D' && e.shiftKey && e.altKey) {
                this.setState({displayComponentShowcase: !this.state.displayComponentShowcase})
            }
        }, true)

        onSwitchedToMainScreen(ipcRenderer, () => {
            this.setState({currentView: View.MAIN})
        })
        onSwitchedToWelcomeScreen(ipcRenderer, () => {
            this.setState({currentView: View.WELCOME})
        })

    }

    render(): any {
        if (this.state.displayComponentShowcase) {
            return (
                <div className="root-view" style={{width: '100%', height: '100%'}} id="root">
                    <ComponentShowcaseView/>
                </div>
            )
        } else {
            if (this.state.currentView === View.WELCOME) {
                return (
                    <div className={"root-view theme-" + this.state.theme} style={{
                        width: '100%',
                        height: '100%',
                    }} id="root">
                        <WelcomeView
                            theme={this.state.theme}
                            onChangeTheme={() => {
                                const nextTheme: Theme = this.state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
                                this.setState({theme: nextTheme})
                            }}/>
                    </div>
                )
            }
            if (this.state.currentView === View.MAIN) {
                return (
                    <div className={"root-view theme-" + this.state.theme} style={{
                        width: '100%',
                        height: '100%',
                    }} id="root">
                        <MainView
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
}