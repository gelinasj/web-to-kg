import GraphItem from "./GraphItem.js";
import Rect from "../shapes/Rect.js";

class Literal extends GraphItem {
    constructor(top, left, width, height, color) {
        super(new Rect(top, left, width, height, color));
    }
}

export default Literal;
