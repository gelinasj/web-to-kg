import GraphItem from "./GraphItem.js";
import Rect from "../shapes/Rect.js";

class Literal extends GraphItem {
    constructor(top, left, width, height, color, borderColor) {
        super(new Rect(top, left, width, height, color, borderColor));
    }
}

export default Literal;
