import GraphItem from "./GraphItem.js";
import Arrow from "../shapes/Arrow.js";

class Connection extends GraphItem {
    constructor(width, startX, startY, endX, endY, color, borderColor) {
        super(new Arrow(width, startX, startY, endX, endY, color, borderColor));
    }

    isResizable() {
        return true;
    }
}

export default Connection;
