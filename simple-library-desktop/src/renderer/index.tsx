import React, {ReactElement} from "react";
import ReactDOM from "react-dom";
import {Application} from "./app/Application";
import "./components/baseStyle.css";
import "./components/commonstyle.css";
import "./components/constants.css";
import "./components/themes.css";
import {initWorker} from "../worker/setup";
import {Compose} from "./components/misc/compose/Compose";
import {AppStateProvider} from "./app/hooks/store/appStore";
import {CollectionActiveStateProvider} from "./app/hooks/store/collectionActiveState";
import {CollectionSidebarStateProvider} from "./app/hooks/store/collectionSidebarState";
import {CollectionsStateProvider} from "./app/hooks/store/collectionsState";
import {ItemSelectionStateProvider} from "./app/hooks/store/itemSelectionState";
import {ItemsStateProvider} from "./app/hooks/store/itemsState";
import {AttributeStateProvider} from "./app/hooks/store/attributeStore";
import {NotificationStateProvider} from "./app/hooks/store/notificationState";
import {DialogStateProvider} from "./app/hooks/store/dialogState";
import {ItemsPageStateProvider} from "./app/hooks/store/itemsPageState";

const log = require("electron-log");
Object.assign(console, log.functions);
console.log("log filepath (renderer):", log.transports.file.getFile().path);

const isWorker: boolean = window.process.argv.some(a => a === "--worker");

if (isWorker) {
	const isDev: boolean = window.process.argv.some(a => a === "--dev");
	initWorker(isDev);
} else {
	ReactDOM.render(withStateProviders(<Application/>), document.getElementById("app"));
}


function withStateProviders(element: ReactElement): ReactElement {
	return (
		<Compose components={[
			AppStateProvider,
			CollectionActiveStateProvider,
			CollectionSidebarStateProvider,
			CollectionsStateProvider,
			ItemSelectionStateProvider,
			ItemsStateProvider,
			ItemsPageStateProvider,
			AttributeStateProvider,
			NotificationStateProvider,
			DialogStateProvider
		]}>
			{element}
		</Compose>
	);
}