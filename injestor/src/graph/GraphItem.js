
class GraphItem {
    constructor(shape) {
        this.shape = shape;
        this.lastUpdated = 0;
        this.updateTime();
    }

    updateTime() {
        this.lastUpdated = new Date().getTime();
    }

    shouldDrawConnectors() {
        this.shape.shouldDrawConnectors();
    }

    draw(ctx) {
        this.shape.draw(ctx);
    }

    resize(resizerId, pX, pY, bounds) {
        this.updateTime();
        this.shape.resize(resizerId, pX, pY, bounds);
    }

    getXOffset(pX) {
        return this.shape.getXOffset(pX);
    }

    getYOffset(pY) {
        return this.shape.getYOffset(pY);
    }

    setLocation(canvasX, canvasY, pX, pY, optional={}) {
        this.updateTime();
        this.shape.setLocation(canvasX, canvasY, pX, pY, optional);
    }

    containsPoint(pX, pY) {
        return this.shape.containsPoint(pX, pY);
    }

    isResizable() {
        return false;
    }

    getClickedResizer(pX, pY) {
        return this.shape.getClickedResizer(pX, pY);
    }

    get connectors() {
        return this.shape.connectors;
    }

    get resizers() {
        return this.shape.resizers;
    }

    focus() {
        this.shape.focus();
    }

    unfocus() {
        this.shape.unfocus();
    }

    joinLiteral(that, thisConnector, thatConnector, mutate) {
        return false;
    }

    joinEnity(that, thisConnector, thatConnector, mutate) {
        return false;
    }

    joinLiteralAndConnection(literal, connection, literalConnector, connectionConnector, mutate) {
        if(literal.connectedItem === null && connectionConnector === "end" && connection.to === null) {
            if(mutate) {
                connection.to = literal;
                literal.connectedItem = connection;
                literal.connector = literalConnector;
            }
            return true;
        } else {
            return false;
        }
    }

    joinEnityAndConnection(entity, connection, entityConnector, connectionConnector, mutate) {
        const connectionType = connectionConnector === "start" ? "from" : "to";
        const direction = connectionConnector === "start" ? "outgoing" : "incoming";
        if(connection[connectionType] === null) {
            if(mutate) {
                entity[direction].push([connection, entityConnector]);
                connection[connectionType] = entity;
            }
            return true;
        } else {
            return false;
        }
    }

    joinConnectionAndConnection(centerConnection, qualifier, mutate) {
        if(qualifier.from === null) {
            if(mutate) {
                qualifier.from = centerConnection;
                centerConnection.qualifiers.push(qualifier);
            }
            return true;
        } else {
            return false
        }
    }

}

export default GraphItem;
