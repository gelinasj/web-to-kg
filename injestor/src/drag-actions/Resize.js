import DragAction from "./DragAction.js"

class Resize extends DragAction {
    constructor(itemId, graphItem, resizerId, mouseX, mouseY) {
        super(itemId, graphItem, mouseX, mouseY);
        this.resizerId = resizerId;
    }

    onMouseUp(subgraph, mouseX, mouseY, proximateConnector, bounds) {
        const draggedItem = subgraph[this.itemId];
        if(proximateConnector !== null) {
            const {nondraggedConnector, nondraggedItem, draggedConnector} = proximateConnector;
            const {x, y} = subgraph[nondraggedItem].connectors[nondraggedConnector];
            const {x:xOffset, y:yOffset} = draggedItem.connectors[draggedConnector];
            draggedItem.resize(this.resizerId, x - draggedItem.getXOffset(xOffset), y - draggedItem.getYOffset(yOffset));
            draggedItem.join(subgraph[nondraggedItem], draggedConnector, nondraggedConnector);
        } else {
            draggedItem.resize(this.resizerId, mouseX - this.xOffset, mouseY - this.yOffset, bounds);
        }
    }

    onMouseMove(subgraph, mouseX, mouseY, bounds) {
        const draggedGraphItem = subgraph[this.itemId];
        draggedGraphItem.resize(this.resizerId, mouseX - this.xOffset, mouseY - this.yOffset, bounds);
        this.xOffset = draggedGraphItem.getXOffset(mouseX);
        this.yOffset = draggedGraphItem.getYOffset(mouseY);
    }
}

export default Resize;
