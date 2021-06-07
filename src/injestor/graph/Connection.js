import GraphItem from "./GraphItem.js";
import Arrow from "../shapes/Arrow.js";
import { getClone } from "../auxillary/auxillary.js";

class Connection extends GraphItem {
    constructor(width, startX, startY, endX, endY, color, borderColor, initializeEmpty=false) {
        super(initializeEmpty ? undefined : new Arrow(width, startX, startY, endX, endY, color, borderColor), initializeEmpty);
        this.to = null;
        this.from = null;
        this.qualifiers = [];
    }

    generalize(tableData, filters) {}

    clone(alreadyCloned) {
      let clone = getClone(this, alreadyCloned);
      if(clone === undefined) {
        clone = new Connection(undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
        super.clone(clone, alreadyCloned);
        alreadyCloned.push([this, clone]);
        clone.to = this.to && this.to.clone(alreadyCloned);
        clone.from = this.from && this.from.clone(alreadyCloned);
        clone.qualifiers = this.qualifiers.map((qualifier) => qualifier.clone(alreadyCloned));
      }
      return clone;
    }

    getTripleData() {
      return [this.from.getRawData(), this.getRawData(), this.to.getRawData()];
    }

    getRawData() {
      return this.kgInfo === null ? null : `knps://wikidata.org/${this.kgInfo.id}`;
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
