import DragAction from "./DragAction.js"

class Translate extends DragAction {
    constructor(itemId, graphItem, firstDrag, mouseX, mouseY) {
        super(itemId, graphItem, mouseX, mouseY);
        this.firstDrag = firstDrag;
    }

    onMouseUp(subgraph, mouseX, mouseY, proximateConnector, bounds) {
        if(this.firstDrag && mouseY < bounds.minY) {
            delete subgraph[this.itemId];
        } else {
            const draggedItem = subgraph[this.itemId];
            if(proximateConnector !== null) {
                const {nondraggedConnector, nondraggedItem, draggedConnector} = proximateConnector;
                const {x, y} = subgraph[nondraggedItem].connectors[nondraggedConnector];
                const {x:xOffset, y:yOffset} = draggedItem.connectors[draggedConnector];
                draggedItem.setLocation(x - draggedItem.getXOffset(xOffset), y - draggedItem.getYOffset(yOffset));
                draggedItem.join(subgraph[nondraggedItem], draggedConnector, nondraggedConnector);
            } else {
                draggedItem.setLocation(mouseX - this.xOffset, mouseY - this.yOffset, bounds);
            }
        }
    }

    onMouseMove(subgraph, mouseX, mouseY, bounds) {
        const draggedGraphItem = subgraph[this.itemId];
        if(this.firstDrag) {
            bounds = {...bounds, minY:0+2};
        }
        draggedGraphItem.setLocation(mouseX - this.xOffset, mouseY - this.yOffset, bounds);
        this.xOffset = draggedGraphItem.getXOffset(mouseX);
        this.yOffset = draggedGraphItem.getYOffset(mouseY);
    }
}

export default Translate;
