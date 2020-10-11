import GraphItem from "./GraphItem.js";
import Arrow from "../shapes/Arrow.js";

class Connection extends GraphItem {
    constructor(width, startX, startY, endX, endY, color) {
        super(new Arrow(width, startX, startY, endX, endY, color));
    }


}

export default Connection;
