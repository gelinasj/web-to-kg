import { generateAction } from "../auxillary/auxillary.js";

class DragAction {
    constructor(itemId, graphItem, mouseX, mouseY) {
        graphItem.updateTime();
        this.itemId = itemId;
        this.xOffset = graphItem.getXOffset(mouseX);
        this.yOffset = graphItem.getYOffset(mouseY);
    }

    static onMouseDown(menuItems, subgraph, mouseX, mouseY) {
        return generateAction(menuItems, subgraph, mouseX, mouseY);
    }
}

export default DragAction;
