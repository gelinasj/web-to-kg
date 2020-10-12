import GraphItem from "./GraphItem.js";
import Circle from "../shapes/Circle.js";

class Entity extends GraphItem {
    constructor(top, left, diameter, color, borderColor) {
        super(new Circle(top, left, diameter, color, borderColor));
    }
}

export default Entity;
