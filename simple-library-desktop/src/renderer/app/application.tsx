import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { onSwitchedToWelcomeScreen } from '../../main/messages';
import { MainView } from './main/mainView';
import { WelcomeView } from './welcome/welcomeView';
import { ComponentShowcaseView } from '../components/showcase/ComponentShowcaseView';

const { ipcRenderer } = window.require('electron');

export enum Theme {
    LIGHT = 'light',
    DARK = 'dark'
}

export enum View {
    WELCOME = 'welcome',
    MAIN = 'main'
}

interface AppState {
    theme: Theme,
    currentView: View,
    displayComponentShowcase: boolean
}

export class Application extends Component<any, AppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            theme: Theme.LIGHT,
            currentView: View.WELCOME,
            displayComponentShowcase: false,
        };
        this.renderComponentShowcase = this.renderComponentShowcase.bind(this);
        this.renderWelcomeView = this.renderWelcomeView.bind(this);
        this.renderMainView = this.renderMainView.bind(this);

        window.addEventListener('keyup', e => { // shift + alt + D => toggle component showcase
            if (e.key === 'D' && e.shiftKey && e.altKey) {
                this.setState({ displayComponentShowcase: !this.state.displayComponentShowcase });
            }
        }, true);

        onSwitchedToWelcomeScreen(ipcRenderer, () => {
            this.setState({ currentView: View.WELCOME });
        });
    }

    renderComponentShowcase() {
        return (
            <div className='root-view' style={{ width: '100%', height: '100%' }} id='root'>
                <ComponentShowcaseView />
            </div>
        );
    }

    renderWelcomeView() {
        return (
            <div className={'root-view theme-' + this.state.theme}
                 style={{ width: '100%', height: '100%' }}
                 id='root'>
                <WelcomeView
                    theme={this.state.theme}
                    onChangeTheme={() => {
                        const nextTheme: Theme = this.state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
                        this.setState({ theme: nextTheme });
                    }}
                    onLoadProject={() => {
                        this.setState({ currentView: View.MAIN });
                    }}
                />
            </div>
        );
    }

    renderMainView() {
        return (
            <div className={'root-view theme-' + this.state.theme}
                 style={{ width: '100%', height: '100%' }}
                 id='root'>
                <MainView
                    theme={this.state.theme}
                    onChangeTheme={() => {
                        const nextTheme: Theme = this.state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
                        this.setState({ theme: nextTheme });
                    }} />
            </div>
        );
    }

    render(): any {
        // return <TestView/>
        if (this.state.displayComponentShowcase) {
            return this.renderComponentShowcase();
        } else {
            if (this.state.currentView === View.WELCOME) {
                return this.renderWelcomeView();
            }
            if (this.state.currentView === View.MAIN) {
                return this.renderMainView();
            }
        }
    }

}

export default hot(Application);
