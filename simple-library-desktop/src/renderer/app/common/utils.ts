import React from 'react';


/*
    * DEFAULT - select single item (deselect all others)
      - win: left-click
      - mac: left-click
    * ADDITIVE - add single item to selection
      - win: left-click + ctrl
      - mac: left-click + cmd
    * RANGE - select all items up to the clicked item
      - win: left-click + shift
      - mac: left-click + shift
      (can be combined with buttons for ADDITIVE => ADDITIVE_RANGE)

    * event.altKey
      - win = "alt"
      - mac = "option"
    * event.ctrl
      - win = "ctrl"
      - mac = "control"
    * event.metaKey
      - win = "windows"
      - mac = "command"
    * event.shift
      - win = "shift"
      - mac = "shift"
 */

export enum SelectMode {
    DEFAULT = "default",
    ADDITIVE = "add",
    RANGE = "range",
    ADDITIVE_RANGE = "add-range"
}

export function getSelectionMode(event: React.MouseEvent): SelectMode {

    let addMode: boolean = false;
    let rangeMode: boolean = false;

    if (process.platform === "darwin") {
        if (event.metaKey) {
            addMode = true;
        }
        if (event.shiftKey) {
            rangeMode = true;
        }
    } else {
        if (event.ctrlKey) {
            addMode = true;
        }
        if (event.shiftKey) {
            rangeMode = true;
        }
    }

    if (addMode && rangeMode) {
        return SelectMode.ADDITIVE_RANGE;
    }
    if (addMode && !rangeMode) {
        return SelectMode.ADDITIVE;
    }
    if (!addMode && rangeMode) {
        return SelectMode.RANGE;
    }
    return SelectMode.DEFAULT;
}