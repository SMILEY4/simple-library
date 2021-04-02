import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { ComponentShowcaseView } from '../components/_showcase/ComponentShowcaseView';
import { WelcomeView } from './welcome/welcomeView';
import { GlobalStateProvider } from './store/provider';
import { NewMainView } from './main/NewMainView';

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
        window.addEventListener('keyup', e => { // shift + alt + D => toggle component _showcase
            if (e.key === 'D' && e.ctrlKey && e.altKey) {
                this.setState({ displayComponentShowcase: !this.state.displayComponentShowcase });
            }
        }, true);
        window.addEventListener('keyup', e => { // shift + alt + T => toggle theme
            if (e.key === 'T' && e.shiftKey && e.altKey) {
                this.setState({ theme: this.state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT });
            }
        }, true);
    }


    render(): any {
        // return (
        //     <div className={'root-view theme-' + this.state.theme}
        //          style={{ width: '100%', height: '100%' }}
        //          id='root'>
        //         <SidebarTestView/>
        //     </div>
        // );
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
            <GlobalStateProvider>
                <div className={'root-view theme-' + this.state.theme}
                     style={{ width: '100%', height: '100%' }}
                     id='root'>
                    <NewMainView
                        // theme={this.state.theme}
                        // onChangeTheme={() => {
                        //     const nextTheme: Theme = this.state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
                        //     this.setState({ theme: nextTheme });
                        // }}
                        // onCloseProject={() => {
                        //     this.setState({ currentView: View.WELCOME });
                        // }}
                    />
                </div>
            </GlobalStateProvider>
        );
    }

}

export default hot(Application);
