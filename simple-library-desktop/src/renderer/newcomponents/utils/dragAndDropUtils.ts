export type DragOpType = "none" | "copy" | "copyLink" | "copyMove" | "link" | "linkMove" | "move" | "all"


export function setDragData(metaId: string, metaData: any, data: any, dragOpType: DragOpType, dataTransfer: DataTransfer) {
    const strData: string = JSON.stringify(data);
    const strMeta: string = JSON.stringify(metaData);
    dataTransfer.setData("text/plain", strData);
    dataTransfer.setData("application/json", strData);
    dataTransfer.setData("custom/" + metaId + ";meta=" + strMeta, strData);
    dataTransfer.effectAllowed = dragOpType;
}
