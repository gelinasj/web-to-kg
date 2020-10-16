import DragAction from "./DragAction.js"

class Translate extends DragAction {
    constructor(itemId, graphItem, firstDrag, mouseX, mouseY) {
        super(itemId, graphItem, mouseX, mouseY);
        this.firstDrag = firstDrag;
    }

    onMouseUp(subgraph, mouseX, mouseY, bounds) {
        if(this.firstDrag) {
            if(mouseY < bounds.minY) {
                delete subgraph[this.itemId];
            } else {
                subgraph[this.itemId].setLocation(mouseX - this.xOffset, mouseY - this.yOffset, bounds);
            };
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
