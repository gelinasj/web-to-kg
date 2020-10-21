import GraphItem from "./GraphItem.js";
import Circle from "../shapes/Circle.js";

class Entity extends GraphItem {
    constructor(top, left, diameter, color, borderColor) {
        super(new Circle(top, left, diameter, color, borderColor));
        this.incoming = [];
        this.outgoing = [];
    }

    setLocation(canvasX, canvasY, pX, pY, optional={}) {
        this.updateTime();
        this.shape.setLocation(canvasX, canvasY, pX, pY, optional);
        this.moveConnections(this.incoming, "end");
        this.moveConnections(this.outgoing, "start");
    }

    moveConnections(connections, resizerId) {
        connections.forEach(([connection, connectorId]) => {
            const {x:xOffset, y:yOffset} = connection.resizers[resizerId];
            const {x, y} = this.connectors[connectorId];
            connection.resize(resizerId, x - connection.getXOffset(xOffset), y - connection.getYOffset(yOffset), undefined, true);
        });
    }

    join(that, thisConnector, thatConnector, mutate=true) {
        return that.joinEnity(this, thatConnector, thisConnector, mutate);
    }

    joinConnection(connection, thisConnector, connectionConnector, mutate) {
        return super.joinEnityAndConnection(this, connection, thisConnector, connectionConnector, mutate);
    }
}

export default Entity;
