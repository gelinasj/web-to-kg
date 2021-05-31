import GraphItem from "./GraphItem.js";
import Circle from "../shapes/Circle.js";
import { getClone } from "../auxillary/auxillary.js";

class Entity extends GraphItem {
    constructor(top, left, diameter, color, borderColor, initializeEmpty=false) {
        super(initializeEmpty ? undefined : new Circle(top, left, diameter, color, borderColor), initializeEmpty);
        this.incoming = [];
        this.outgoing = [];
    }

    getRawData() {
      return this.kgInfo === null ? null : `knps://wikidata.org/${this.kgInfo.id}`;
    }

    getBindingInfo() {
      const bindingColumns = Object.keys(this.bindings);
      if(bindingColumns.length > 0) {
        return {
          binding: bindingColumns[0],
          kgInfo: this.kgInfo || undefined
        };
      } else {
        return undefined;
      }
    }

    clone(alreadyCloned) {
      let clone = getClone(this, alreadyCloned);
      if(clone === undefined) {
        clone = new Entity(undefined, undefined, undefined, undefined, undefined, true);
        super.clone(clone, alreadyCloned);
        alreadyCloned.push([this, clone]);
        clone.incoming = this.incoming.map(([item, connectorId]) => [item.clone(alreadyCloned), connectorId]);
        clone.outgoing = this.outgoing.map(([item, connectorId]) => [item.clone(alreadyCloned), connectorId]);
      }
      return clone;
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

    disjoin() {
      this.incoming.forEach(function([connection, connector]) {
        connection.disjoinThat(this)
      }.bind(this));
      this.outgoing.forEach(function([connection, connector]) {
        connection.disjoinThat(this)
      }.bind(this));
      this.incoming = [];
      this.outgoing = [];
    }

    disjoinThat(that) {
      this.incoming.filter(([connection, connector]) => that !== connection);
      this.incoming.filter(([connection, connector]) => that !== connection);
    }
}

export default Entity;
