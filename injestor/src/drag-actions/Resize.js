import DragAction from "./DragAction.js"

class Resize extends DragAction {
    constructor(itemId, graphItem, resizerId, mouseX, mouseY) {
        super(itemId, graphItem, mouseX, mouseY);
        this.resizerId = resizerId;
    }

    onMouseUp(subgraph, mouseX, mouseY, bounds) {
        const draggedGraphItem = subgraph[this.itemId];
        draggedGraphItem.resize(this.resizerId, mouseX - this.xOffset, mouseY - this.yOffset, bounds);
    }

    onMouseMove(subgraph, mouseX, mouseY, bounds) {
        const draggedGraphItem = subgraph[this.itemId];
        draggedGraphItem.resize(this.resizerId, mouseX - this.xOffset, mouseY - this.yOffset, bounds);
        this.xOffset = draggedGraphItem.getXOffset(mouseX);
        this.yOffset = draggedGraphItem.getYOffset(mouseY);
    }
}

export default Resize;
