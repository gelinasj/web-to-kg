import GraphItem from "./GraphItem.js";
import Circle from "../shapes/Circle.js";

class Entity extends GraphItem {
    constructor(top, left, diameter, color) {
        super(new Circle(top, left, diameter, color));
    }
}

export default Entity;
