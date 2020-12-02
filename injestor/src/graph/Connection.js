import GraphItem from "./GraphItem.js";
import Arrow from "../shapes/Arrow.js";

class Connection extends GraphItem {
    constructor(width, startX, startY, endX, endY, color, borderColor) {
        super(new Arrow(width, startX, startY, endX, endY, color, borderColor));
        this.to = null;
        this.from = null;
        this.qualifiers = [];
    }

    getTripleData() {
      return [this.from.getRawData(), this.getRawData(), this.to.getRawData()];
    }

    setLocation(canvasX, canvasY, pX, pY, optional={}) {
        this.updateTime();
        if(this.to === null && this.from === null) {
            this.shape.setLocation(canvasX, canvasY, pX, pY, optional);
            const {x, y} = this.connectors["center"];
            this.qualifiers.forEach((qualifier) => {
                qualifier.resize("start", x, y, undefined, true);
            });
        }
    }

    resize(resizerId, pX, pY, bounds, indirect=false) {
        this.updateTime();
        if(this[resizerId === "start" ? "from" : "to"] === null || indirect) {
            this.shape.resize(resizerId, pX, pY, bounds);
            const {x, y} = this.connectors["center"];
            this.qualifiers.forEach((qualifier) => {
                qualifier.resize("start", x, y, undefined, true);
            });
        }
    }

    isResizable() {
        return true;
    }

    join(that, thisConnector, thatConnector, mutate=true) {
        return that.joinConnection(this, thatConnector, thisConnector, mutate);
    }

    joinLiteral(literal, thisConnector, literalConnector, mutate) {
        return super.joinLiteralAndConnection(literal, this, literalConnector, thisConnector, mutate);
    }

    joinEnity(entity, thisConnector, entityConnector, mutate) {
        return super.joinEnityAndConnection(entity, this, entityConnector, thisConnector, mutate);
    }

    joinConnection(thatConnection, thisConnector, thatConnector, mutate=true) {
        if(thisConnector === "center" && thatConnector === "start") {
            return super.joinConnectionAndConnection(this, thatConnection, mutate);
        } else if(thatConnector === "center" && thisConnector === "start") {
            return super.joinConnectionAndConnection(thatConnection, this, mutate);
        } else {
            return false;
        }
    }

    disjoin() {
      this.to === null || this.to.disjoinThat(this);
      this.from === null || this.from.disjoinThat(this);
      this.qualifiers.forEach(function(qualifier) {
        qualifier.disjoinThat(this)
      }.bind(this));

    }

    disjoinThat(that) {
      if(that === this.to) {
        this.to = null; return;
      }
      if (that === this.from) {
        this.from = null; return;
      }
      this.qualifiers.filter((qualifier) => that !== qualifier);
    }
}

export default Connection;
